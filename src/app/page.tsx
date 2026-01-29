'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Camera, Download, RotateCcw, Palette, Settings, Maximize2, X } from 'lucide-react';

// Types
interface BikeColors {
  body: string;
  wheels: string;
  seat: string;
  mirrors: string;
  frame: string;
}

interface PresetColor {
  name: string;
  hex: string;
  category: string;
}

// Constants
const PRESET_COLORS: PresetColor[] = [
  { name: 'Yamaha Blue', hex: '#0066CC', category: 'brand' },
  { name: 'Honda Red', hex: '#CC0000', category: 'brand' },
  { name: 'Matte Black', hex: '#1a1a1a', category: 'neutral' },
  { name: 'Pearl White', hex: '#F5F5F5', category: 'neutral' },
  { name: 'Racing Yellow', hex: '#FFD700', category: 'vibrant' },
  { name: 'Neon Green', hex: '#39FF14', category: 'vibrant' },
  { name: 'Orange Blaze', hex: '#FF6600', category: 'vibrant' },
  { name: 'Purple Haze', hex: '#9370DB', category: 'vibrant' },
  { name: 'Gunmetal', hex: '#2C3539', category: 'metallic' },
  { name: 'Army Green', hex: '#4B5320', category: 'matte' },
  { name: 'Sky Blue', hex: '#87CEEB', category: 'pastel' },
  { name: 'Hot Pink', hex: '#FF69B4', category: 'vibrant' }
];

const MOTORCYCLE_PARTS = [
  { id: 'body' as const, label: 'Body Panels', description: 'Main fairings' },
  { id: 'wheels' as const, label: 'Wheels', description: 'Rims & tires' },
  { id: 'seat' as const, label: 'Seat', description: 'Saddle cover' },
  { id: 'mirrors' as const, label: 'Mirrors', description: 'Side mirrors' },
  { id: 'frame' as const, label: 'Frame', description: 'Chassis' }
];

export default function MotoPHCustomizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<keyof BikeColors>('body');
  const [colors, setColors] = useState<BikeColors>({
    body: '#CC0000',
    wheels: '#1a1a1a',
    seat: '#2a2a2a',
    mirrors: '#C0C0C0',
    frame: '#3a3a3a'
  });
  const [customColor, setCustomColor] = useState('#FF0000');
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // 3D Scene refs
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const motorcyclePartsRef = useRef<Record<string, THREE.Mesh>>({});
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Professional lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Key light (main) - stronger
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    scene.add(keyLight);

    // Fill light - stronger
    const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.6);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Rim light - stronger
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    // Front light to ensure visibility
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 3, 10);
    scene.add(frontLight);

    // Accent lights
    const accentLight1 = new THREE.PointLight(0xff6600, 0.5, 10);
    accentLight1.position.set(3, 1, 3);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x0066cc, 0.5, 10);
    accentLight2.position.set(-3, 1, -3);
    scene.add(accentLight2);

    // Studio floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f0f0f,
      metalness: 0.8,
      roughness: 0.4
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0; // Floor at ground level
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid for studio feel
    const gridHelper = new THREE.GridHelper(20, 40, 0x222222, 0x111111);
    gridHelper.position.y = 0.01; // Slightly above floor
    scene.add(gridHelper);

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

    // Load NMAX model
    const loader = new GLTFLoader();
    loader.load(
      '/models/nmax_motorbike/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        
        // Calculate bounding box to understand model size
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        console.log('📏 Model size:', size);
        console.log('📍 Model center:', center);
        
        // Scale based on size (adjust to make it about 3 units tall)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.set(scale, scale, scale);
        
        // Center the model and lift it up
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale + 1.5; // Lift higher off floor
        model.position.z = -center.z * scale;
        
        console.log('✅ Applied scale:', scale);
        
        // Enable shadows and collect ALL parts
        const allParts: string[] = [];
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhanced materials with visible fallback
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.envMapIntensity = 1.5;
                  mat.needsUpdate = true;
                });
              } else {
                child.material.envMapIntensity = 1.5;
                child.material.needsUpdate = true;
              }
            }
            
            // Store ALL meshes - we'll figure out which is which
            const name = child.name.toLowerCase();
            allParts.push(child.name);
            motorcyclePartsRef.current[name] = child;
            
            // Also try parent names
            if (child.parent && child.parent.name) {
              motorcyclePartsRef.current[child.parent.name.toLowerCase()] = child;
            }
          }
        });

        scene.add(model);
        setLoading(false);
        
        console.log('✅ NMAX loaded successfully!');
        console.log('📦 Total meshes found:', allParts.length);
        console.log('🔍 Mesh names:', allParts);
        console.log('💾 Stored parts:', Object.keys(motorcyclePartsRef.current));
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading: ${percent.toFixed(0)}%`);
      },
      (error) => {
        console.error('❌ Error loading model:', error);
        setLoading(false);
      }
    );

    // Animation loop
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Update colors
  useEffect(() => {
    const parts = motorcyclePartsRef.current;
    
    Object.entries(colors).forEach(([partName, color]) => {
      const mesh = parts[partName];
      if (mesh && mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            mat.color.set(color);
          });
        } else {
          mesh.material.color.set(color);
        }
      }
    });
  }, [colors]);

  // Auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Functions
  const applyColor = (color: string) => {
    setColors(prev => ({ ...prev, [selectedPart]: color }));
  };

  const resetColors = () => {
    setColors({
      body: '#CC0000',
      wheels: '#1a1a1a',
      seat: '#2a2a2a',
      mirrors: '#C0C0C0',
      frame: '#3a3a3a'
    });
  };

  const randomizeColors = () => {
    const getRandomColor = () => PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].hex;
    setColors({
      body: getRandomColor(),
      wheels: getRandomColor(),
      seat: getRandomColor(),
      mirrors: getRandomColor(),
      frame: getRandomColor()
    });
  };

  const downloadScreenshot = () => {
    if (!rendererRef.current) return;
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `motoph-custom-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const resetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5, 3, 8);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                MotoPH Professional Studio
              </h1>
              <p className="text-sm text-gray-400 mt-1">3D Motorcycle Customization Platform</p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 h-[calc(100vh-88px)] flex gap-4">
        {/* Main 3D Viewer */}
        <div className="flex-1 relative">
          <div 
            ref={containerRef} 
            className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xl font-semibold">Loading NMAX Model...</p>
                  <p className="text-sm text-gray-400 mt-2">Professional 3D Studio</p>
                </div>
              </div>
            )}

            {/* Floating Controls */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all border border-gray-700"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={resetView}
                className="p-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all border border-gray-700"
                title="Reset Camera"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-3 rounded-lg backdrop-blur-md transition-all border border-gray-700 ${
                  autoRotate ? 'bg-orange-600/80 hover:bg-orange-700/80' : 'bg-black/60 hover:bg-black/80'
                }`}
                title="Auto Rotate"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 z-20">
              <button
                onClick={downloadScreenshot}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-semibold flex items-center gap-2 transition-all shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export HD</span>
              </button>
              <button
                onClick={randomizeColors}
                className="px-6 py-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 font-semibold flex items-center gap-2 transition-all border border-gray-700"
              >
                <Palette className="w-5 h-5" />
                <span className="hidden sm:inline">Randomize</span>
              </button>
              <button
                onClick={resetColors}
                className="px-6 py-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 font-semibold transition-all border border-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-96 space-y-4 overflow-y-auto">
          {/* Part Selection */}
          <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Select Component</h3>
            <div className="space-y-2">
              {MOTORCYCLE_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
                    selectedPart === part.id
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-500'
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <div className="font-semibold text-white">{part.label}</div>
                  <div className="text-sm text-gray-400 mt-1">{part.description}</div>
                  <div 
                    className="w-8 h-8 rounded-lg mt-2 border-2 border-white/20"
                    style={{ backgroundColor: colors[part.id] }}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Color Presets</h3>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.hex}
                  onClick={() => applyColor(preset.hex)}
                  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700 hover:border-orange-500 transition-all hover:scale-105"
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                >
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-semibold text-white text-center px-2">
                      {preset.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-gray-200">Custom Color</h3>
            <div className="space-y-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-full h-16 rounded-lg cursor-pointer border-2 border-gray-700"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none font-mono"
                placeholder="#FF0000"
              />
              <button
                onClick={() => applyColor(customColor)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-semibold transition-all"
              >
                Apply to {MOTORCYCLE_PARTS.find(p => p.id === selectedPart)?.label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}