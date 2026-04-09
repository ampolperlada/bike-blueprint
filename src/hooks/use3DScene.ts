import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import {
  applyColorToMesh,
  detectPartType,
  enhanceMaterial,
  centerAndScaleModel,
} from '@/lib/utils/3d-helpers';

import { fitCameraToModel } from '@/lib/utils/camera-helpers';
import { partHighlighter } from '@/lib/utils/part-highlighter';
import { PartType } from '@/types/parts';

import { BikeColors } from '@/types/bike';

export function use3DScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
  colors: BikeColors
) {
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const motorcyclePartsRef = useRef<Record<string, THREE.Mesh>>({});
  const animationFrameRef = useRef<number>(0);

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();

    // Background gradient
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#0f0f1e');
    gradient.addColorStop(1, '#050510');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 512);
    scene.background = new THREE.CanvasTexture(canvas);
    scene.fog = new THREE.Fog(0x0a0a0a, 15, 50);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 8); // fallback position
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Environment (PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1a2e);
    scene.environment = pmremGenerator.fromScene(envScene).texture;

    // Lighting, Floor & Grid
    setupLighting(scene);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.6,
        roughness: 0.8,
        envMapIntensity: 0.5,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(30, 60, 0x1a1a1a, 0x0d0d0d);
    grid.position.y = 0.01;
    (grid.material as THREE.Material).opacity = 0.5;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // Load model
    loadModel(scene, camera, controls, motorcyclePartsRef, setLoading);

    // Animation loop
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);

  // Update colors when they change
  useEffect(() => {
    const parts = motorcyclePartsRef.current;
    Object.entries(colors).forEach(([partName, color]) => {
      const mesh = parts[partName];
      if (mesh && applyColorToMesh(mesh, color)) {
        console.log(`✅ Applied ${color} to ${partName}`);
      }
    });
  }, [colors]);

  // Update auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // ====================== PART HIGHLIGHTING ======================
  const highlightPart = useCallback((partType: PartType) => {
    partHighlighter.highlightPartsByType(motorcyclePartsRef.current, partType);
  }, []);

  const unhighlightPart = useCallback((partType: PartType) => {
    partHighlighter.unhighlightPartsByType(motorcyclePartsRef.current, partType);
  }, []);

  const selectPart = useCallback((partType: PartType) => {
    partHighlighter.selectPartsByType(motorcyclePartsRef.current, partType);
  }, []);

  const clearSelection = useCallback(() => {
    partHighlighter.clearSelection();
  }, []);

  // ====================== UTILITY FUNCTIONS ======================
  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5, 3, 8);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const captureScreenshot = (): string => {
    if (!rendererRef.current) return '';
    return rendererRef.current.domElement.toDataURL('image/png');
  };

  return {
    loading,
    autoRotate,
    setAutoRotate,
    resetCamera,
    captureScreenshot,
    motorcyclePartsRef,

    // New highlighting functions
    highlightPart,
    unhighlightPart,
    selectPart,
    clearSelection,

    // Optional: Expose camera & controls for future use
    // camera: cameraRef.current,
    // controls: controlsRef.current,
  };
}

// ─────────────────────────────────────────────────────────────
// Lighting setup
function setupLighting(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(8, 12, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 4096;
  keyLight.shadow.mapSize.height = 4096;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x6ba3ff, 0.5);
  fillLight.position.set(-8, 6, 4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
  rimLight.position.set(-3, 8, -8);
  scene.add(rimLight);

  const bounceLight = new THREE.DirectionalLight(0x4a5568, 0.3);
  bounceLight.position.set(0, -5, 0);
  scene.add(bounceLight);

  const accent1 = new THREE.PointLight(0xff6600, 1.2, 12);
  accent1.position.set(4, 2, 4);
  scene.add(accent1);

  const accent2 = new THREE.PointLight(0x0066ff, 1.0, 12);
  accent2.position.set(-4, 2, -4);
  scene.add(accent2);
}

// ─────────────────────────────────────────────────────────────
// Updated model loader with auto-fit
function loadModel(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  partsRef: React.MutableRefObject<Record<string, THREE.Mesh>>,
  setLoading: (loading: boolean) => void
) {
  const loader = new GLTFLoader();

  loader.load(
    '/models/nmax_motorbike/scene.gltf',
    (gltf) => {
      const model = gltf.scene;

      // Center and scale model
      const { scale: modelScale, position } = centerAndScaleModel(model);
      model.scale.set(modelScale, modelScale, modelScale);
      model.position.copy(position);

      // Add to scene first
      scene.add(model);

      // Auto-fit camera to model (after adding to scene)
      fitCameraToModel(camera, controls, model, {
        offset: 1.3,
        centerY: 0.8,
      });

      // Traverse to setup meshes and detect parts
      const meshByIndex: Record<number, THREE.Mesh> = {};
      let meshIndex = 0;

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            materials.forEach(enhanceMaterial);
          }

          meshByIndex[meshIndex] = child;
          partsRef.current[`mesh_${meshIndex}`] = child;

          const partType = detectPartType(child.name);
          if (partType && !partsRef.current[partType]) {
            partsRef.current[partType] = child;
            console.log(`✅ Auto-detected ${partType}:`, child.name);
          }
          meshIndex++;
        }
      });

      // Fallback part assignments
      const partTypes = ['body', 'wheels', 'seat', 'mirrors', 'frame', 'exhaust'];
      partTypes.forEach((partType, index) => {
        if (!partsRef.current[partType] && meshByIndex[index]) {
          partsRef.current[partType] = meshByIndex[index];
          console.log(`⚠️ Fallback: mesh_${index} → ${partType}`);
        }
      });

      setLoading(false);
      console.log(
        '✅ Model loaded. Parts:',
        Object.keys(partsRef.current).filter((k) => !k.startsWith('mesh_'))
      );
    },
    undefined,
    (error) => {
      console.error('❌ Model load error:', error);
      setLoading(false);
    }
  );
}