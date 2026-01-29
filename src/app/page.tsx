'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, Palette, Maximize2, Info, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';           // ← added
import { PRESET_COLORS, DEFAULT_COLORS } from '@/lib/constants/colors';
import { MOTORCYCLE_PARTS, type PartId } from '@/lib/constants/parts';
import { cn } from '@/lib/utils/cn';

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const motorcyclePartsRef = useRef<Record<string, THREE.Mesh>>({});
  const animationFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });

  const [selectedPart, setSelectedPart] = useState<PartId>('body');
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [customColor, setCustomColor] = useState('#FF0000');
  const [isLoading, setIsLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xdddddd);
    gridHelper.position.y = -0.99;
    scene.add(gridHelper);

    // ── Load real NMAX model ──────────────────────────────────────────────
    const loader = new GLTFLoader();
    const motorcycleParts: Record<string, THREE.Mesh> = {};

    loader.load(
      '/models/nmax.gltf', // Make sure this file exists in public/models/
      (gltf) => {
        const model = gltf.scene;
        
        // Scale / position / rotate to match roughly the old primitive view
        model.scale.set(2, 2, 2);
        model.position.set(0, -1, 0);
        model.rotation.y = Math.PI / 4;
        
        // Enable shadows + prepare parts for color changing
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Clone material so we can modify color independently
            if (child.material) {
              child.material = (child.material as THREE.Material).clone();
            }

            const name = child.name.toLowerCase();

            if (name.includes('body') || name.includes('fairing') || 
                name.includes('panel') || name.includes('cowl')) {
              motorcycleParts[`body_${child.name}`] = child;
            }
            else if (name.includes('wheel') || name.includes('rim') || 
                     name.includes('tire')) {
              motorcycleParts[`wheel_${child.name}`] = child;
            }
            else if (name.includes('seat') || name.includes('saddle')) {
              motorcycleParts[`seat_${child.name}`] = child;
            }
            else if (name.includes('mirror')) {
              motorcycleParts[`mirror_${child.name}`] = child;
            }
            else if (name.includes('frame') || name.includes('chassis')) {
              motorcycleParts[`frame_${child.name}`] = child;
            }
          }
        });

        scene.add(model);
        motorcyclePartsRef.current = motorcycleParts;
        setIsLoading(false);
        
        console.log('🏍️ NMAX loaded! Parts found:', Object.keys(motorcycleParts));
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(0);
        console.log(`Loading model: ${percent}%`);
      },
      (error) => {
        console.error('❌ Error loading model:', error);
        setIsLoading(false);
        alert('Could not load 3D model. Check console for details.');
      }
    );

    // Mouse/touch controls
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      setAutoRotate(false);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMouseRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - previousMouseRef.current.x;
      
      const rotationSpeed = 0.005;
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
      
      previousMouseRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    renderer.domElement.addEventListener('mousedown', handlePointerDown);
    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('mouseup', handlePointerUp);
    renderer.domElement.addEventListener('touchstart', handlePointerDown as any);
    renderer.domElement.addEventListener('touchmove', handlePointerMove as any);
    renderer.domElement.addEventListener('touchend', handlePointerUp);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (autoRotate) {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.003);
      }
      
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update colors when changed
  useEffect(() => {
    const parts = motorcyclePartsRef.current;
    if (!parts || Object.keys(parts).length === 0) return;

    Object.entries(colors).forEach(([category, hexColor]) => {
      const matchingParts = Object.entries(parts).filter(([key]) => 
        key.startsWith(`${category}_`)
      );

      matchingParts.forEach(([, mesh]) => {
        if (mesh.material instanceof THREE.Material) {
          (mesh.material as THREE.MeshStandardMaterial).color.setStyle(hexColor);
        }
      });
    });
  }, [colors]);

  const applyColor = (color: string) => {
    setColors(prev => ({
      ...prev,
      [selectedPart]: color
    }));
  };

  const downloadScreenshot = () => {
    if (!rendererRef.current) return;
    const link = document.createElement('a');
    link.download = 'my-custom-nmax-3d.png';
    link.href = rendererRef.current.domElement.toDataURL('image/png');
    link.click();
  };

  const resetView = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(5, 3, 8);
    setAutoRotate(true);
  };

  const resetColors = () => {
    setColors(DEFAULT_COLORS);
  };

  const generateRandomColors = () => {
    const randomPreset = () => PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].hex;
    setColors({
      body: randomPreset(),
      wheels: randomPreset(),
      seat: randomPreset(),
      mirrors: randomPreset(),
      frame: randomPreset()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">🏍️</span>
            MotoPH 3D Customizer
          </h1>
          <p className="text-gray-400 text-lg">Rotate, customize, and see your NMAX in full 3D!</p>
          <p className="text-yellow-400 text-sm mt-2">✨ Drag to rotate • Mobile friendly</p>
        </div>

        {/* The rest of your UI stays exactly the same */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ height: '500px' }}>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center">
                      <div className="animate-spin text-6xl mb-4">🏍️</div>
                      <p className="text-gray-600">Loading real NMAX model...</p>
                    </div>
                  </div>
                )}
                <div ref={mountRef} className="w-full h-full" />
                
                {/* Controls overlay */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg text-sm">
                  <p>🖱️ Drag to rotate</p>
                  <p className="text-xs text-gray-300 mt-1">Touch: Swipe to spin</p>
                </div>

                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  <Info size={20} />
                </button>

                {showInfo && (
                  <div className="absolute top-16 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs z-20">
                    <h4 className="font-bold mb-2">3D Viewer Features:</h4>
                    <ul className="text-sm space-y-1">
                      <li>✓ Realistic lighting & shadows</li>
                      <li>✓ 360° rotation view</li>
                      <li>✓ Real-time color changes</li>
                      <li>✓ Separate part customization</li>
                      <li>✓ Mobile-friendly controls</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                <button
                  onClick={downloadScreenshot}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={resetView}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Maximize2 size={20} />
                  <span className="hidden sm:inline">Reset View</span>
                </button>
                <button
                  onClick={generateRandomColors}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Sparkles size={20} />
                  <span className="hidden sm:inline">Random</span>
                </button>
                <button
                  onClick={resetColors}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 md:px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <RotateCcw size={20} />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={cn(
                    'flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg transition-colors font-medium',
                    autoRotate ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-700'
                  )}
                >
                  🔄 <span className="hidden sm:inline">{autoRotate ? 'Auto-On' : 'Auto-Off'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Controls Panel — remains unchanged */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <Palette size={24} className="text-blue-600" />
                Select Part
              </h3>
              <div className="space-y-2">
                {MOTORCYCLE_PARTS.map(part => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPart(part.id)}
                    className={cn(
                      'w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all text-sm md:text-base',
                      selectedPart === part.id
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 hover:bg-gray-200'
                    )}
                    title={part.description}
                  >
                    <span className="text-xl mr-2">{part.icon}</span>
                    <span className="font-medium">{part.label}</span>
                    {selectedPart === part.id && <span className="float-right">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Colors */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">Popular Colors</h3>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => applyColor(color.hex)}
                    className="group relative"
                    title={color.name}
                  >
                    <div
                      className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all shadow-md"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs text-center block mt-1 text-gray-600 group-hover:text-blue-600 font-medium truncate">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">Custom Color</h3>
              <div className="space-y-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full h-12 md:h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#FF0000"
                  className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm md:text-base"
                />
                <button
                  onClick={() => applyColor(customColor)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Apply Custom Color
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-400 rounded-2xl p-4">
              <h4 className="font-bold text-blue-800 mb-2">🚀 Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Full 360° rotation</li>
                <li>✓ Real-time color updates</li>
                <li>✓ 5 customizable parts</li>
                <li>✓ Mobile touch controls</li>
                <li>✓ HD screenshot export</li>
              </ul>
              <p className="text-xs text-blue-600 mt-3">
                💡 Now using real NMAX 3D model!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Built with Three.js • Created by Christian Paul Perlada</p>
          <p className="mt-2">Real GLTF model loaded • Ready for production! 🎨</p>
        </div>
      </div>
    </div>
  );
}