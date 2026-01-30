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
  // Yamaha Colors
  { name: 'Yamaha Blue', hex: '#0062A5', category: 'brand' },
  { name: 'Yamaha Racing Blue', hex: '#003087', category: 'brand' },
  { name: 'Yamaha Red', hex: '#D31245', category: 'brand' },
  
  // Honda Colors
  { name: 'Honda Red', hex: '#CC0000', category: 'brand' },
  { name: 'Honda Victory Red', hex: '#B50C18', category: 'brand' },
  { name: 'Honda Pearl White', hex: '#F8F8F8', category: 'brand' },
  
  // Popular Matte Colors (trending in PH)
  { name: 'Matte Black', hex: '#1C1C1C', category: 'matte' },
  { name: 'Matte Gray', hex: '#4A4A4A', category: 'matte' },
  { name: 'Matte Army Green', hex: '#50563A', category: 'matte' },
  { name: 'Matte Navy Blue', hex: '#1B2B3A', category: 'matte' },
  
  // Metallic Colors
  { name: 'Gunmetal Gray', hex: '#2C3539', category: 'metallic' },
  { name: 'Silver Metallic', hex: '#BFC1C2', category: 'metallic' },
  { name: 'Gold Metallic', hex: '#D4AF37', category: 'metallic' },
  { name: 'Bronze Metallic', hex: '#CD7F32', category: 'metallic' },
  
  // Vibrant Colors (popular for custom builds)
  { name: 'Racing Yellow', hex: '#FFC800', category: 'vibrant' },
  { name: 'Kawasaki Green', hex: '#00A84F', category: 'vibrant' },
  { name: 'Neon Orange', hex: '#FF5F1F', category: 'vibrant' },
  { name: 'Electric Blue', hex: '#00D4FF', category: 'vibrant' },
  
  // Classic Colors
  { name: 'Glossy White', hex: '#FFFFFF', category: 'classic' },
  { name: 'Jet Black', hex: '#0A0A0A', category: 'classic' },
  { name: 'Deep Red', hex: '#8B0000', category: 'classic' },
  { name: 'Royal Blue', hex: '#1E3A8A', category: 'classic' }
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
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPartsForPurchase, setSelectedPartsForPurchase] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const [hoveredMesh, setHoveredMesh] = useState<string | null>(null);

  // Parts Catalog with Real Philippine Prices
  const PARTS_CATALOG = [
    {
      id: 'body',
      name: 'Body Panel Set',
      description: 'Complete fairing set with paint',
      price: 8500,
      installTime: '2-3 hours'
    },
    {
      id: 'wheels',
      name: 'Wheel Rims',
      description: 'Alloy rims (front + rear)',
      price: 6500,
      installTime: '1 hour'
    },
    {
      id: 'seat',
      name: 'Seat Cover',
      description: 'Custom leather/vinyl seat',
      price: 1500,
      installTime: '30 mins'
    },
    {
      id: 'mirrors',
      name: 'Side Mirrors',
      description: 'Pair of aerodynamic mirrors',
      price: 800,
      installTime: '15 mins'
    },
    {
      id: 'frame',
      name: 'Frame Paint',
      description: 'Professional frame coating',
      price: 3500,
      installTime: '4 hours'
    }
  ];

  // 3D Scene refs
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const motorcyclePartsRef = useRef<Record<string, THREE.Mesh>>({});
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup with gradient background
    const scene = new THREE.Scene();
    
    // Create professional studio background gradient
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const context = canvas.getContext('2d')!;
    const gradient = context.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#1a1a2e'); // Dark blue-black at top
    gradient.addColorStop(0.5, '#0f0f1e'); // Darker middle
    gradient.addColorStop(1, '#050510'); // Almost black at bottom
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 512);
    
    const backgroundTexture = new THREE.CanvasTexture(canvas);
    scene.background = backgroundTexture;
    scene.fog = new THREE.Fog(0x0a0a0a, 15, 50);
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
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create environment map for reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    // Simple gradient environment for reflections
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1a2e);
    const envTexture = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTexture;

    // Professional lighting setup - Studio quality
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Key light (main) - from top-front-right
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

    // Fill light - from left, softer
    const fillLight = new THREE.DirectionalLight(0x6ba3ff, 0.5);
    fillLight.position.set(-8, 6, 4);
    scene.add(fillLight);

    // Rim light - from behind, creates edge highlight
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLight.position.set(-3, 8, -8);
    scene.add(rimLight);

    // Ground bounce light - simulates floor reflection
    const bounceLight = new THREE.DirectionalLight(0x4a5568, 0.3);
    bounceLight.position.set(0, -5, 0);
    scene.add(bounceLight);

    // Accent lights for drama
    const accentLight1 = new THREE.PointLight(0xff6600, 1.2, 12);
    accentLight1.position.set(4, 2, 4);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x0066ff, 1.0, 12);
    accentLight2.position.set(-4, 2, -4);
    scene.add(accentLight2);

    // Professional studio floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.6,
      roughness: 0.8,
      envMapIntensity: 0.5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle grid for depth perception
    const gridHelper = new THREE.GridHelper(30, 60, 0x1a1a1a, 0x0d0d0d);
    gridHelper.position.y = 0.01;
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;
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
        
        // Center the model and lift it properly
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale + 0.8; // Lift higher off ground
        model.position.z = -center.z * scale;
        
        console.log('✅ Applied scale:', scale);
        
        // Enhanced material processing and part collection
        const allParts: string[] = [];
        let materialCount = 0;
        
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Enhance materials for better appearance
            if (child.material) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              
              materials.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  // Enhance existing materials
                  mat.envMapIntensity = 1.5;
                  mat.roughness = Math.min(mat.roughness, 0.6);
                  mat.metalness = Math.max(mat.metalness, 0.3);
                  mat.needsUpdate = true;
                  materialCount++;
                }
              });
            }
            
            // Store ALL meshes with multiple naming strategies
            const name = child.name.toLowerCase();
            allParts.push(child.name);
            
            // Store by original name
            if (name) {
              motorcyclePartsRef.current[name] = child;
            }
            
            // Store by parent name if available
            if (child.parent && child.parent.name) {
              const parentName = child.parent.name.toLowerCase();
              motorcyclePartsRef.current[parentName] = child;
            }
            
            // Try to detect part type by name keywords
            const detectPartType = (meshName: string) => {
              const n = meshName.toLowerCase();
              if (n.includes('body') || n.includes('fairing') || n.includes('panel') || n.includes('cowl')) {
                motorcyclePartsRef.current['body'] = child;
              }
              if (n.includes('wheel') || n.includes('rim') || n.includes('tire')) {
                motorcyclePartsRef.current['wheels'] = child;
              }
              if (n.includes('seat') || n.includes('saddle')) {
                motorcyclePartsRef.current['seat'] = child;
              }
              if (n.includes('mirror')) {
                motorcyclePartsRef.current['mirrors'] = child;
              }
              if (n.includes('frame') || n.includes('chassis') || n.includes('fork')) {
                motorcyclePartsRef.current['frame'] = child;
              }
            };
            
            detectPartType(child.name);
            if (child.parent?.name) {
              detectPartType(child.parent.name);
            }
          }
        });

        scene.add(model);
        setLoading(false);
        
        console.log('✅ NMAX loaded successfully!');
        console.log('📦 Total meshes found:', allParts.length);
        console.log('🎨 Materials enhanced:', materialCount);
        console.log('🔍 Mesh names:', allParts);
        console.log('💾 Stored parts:', Object.keys(motorcyclePartsRef.current));
        console.log('🎯 Type this in console to see all parts: Object.keys(motorcyclePartsRef.current)');
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

  // Update colors - improved to handle all mesh types
  useEffect(() => {
    const parts = motorcyclePartsRef.current;
    
    Object.entries(colors).forEach(([partName, color]) => {
      // Try to find the specific part
      const mesh = parts[partName];
      
      if (mesh && mesh.material) {
        // Apply color to found part
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.color.set(color);
            mat.needsUpdate = true;
          }
        });
        console.log(`✅ Applied ${color} to ${partName}`);
      } else {
        // If specific part not found, try all stored parts with similar names
        Object.keys(parts).forEach(key => {
          if (key.includes(partName) || partName.includes(key)) {
            const similarMesh = parts[key];
            if (similarMesh && similarMesh.material) {
              const materials = Array.isArray(similarMesh.material) ? similarMesh.material : [similarMesh.material];
              materials.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                  mat.color.set(color);
                  mat.needsUpdate = true;
                }
              });
              console.log(`✅ Applied ${color} to similar part: ${key} (searching for ${partName})`);
            }
          }
        });
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

  const testColorOnAllParts = (color: string) => {
    // Test function - apply color to EVERY mesh to verify color changing works
    const parts = motorcyclePartsRef.current;
    let coloredCount = 0;
    
    Object.values(parts).forEach((mesh) => {
      if (mesh && mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            mat.color.set(color);
            mat.needsUpdate = true;
            coloredCount++;
          }
        });
      }
    });
    
    console.log(`🎨 TEST: Applied ${color} to ${coloredCount} materials`);
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
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
    
    // Render high-quality image
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    
    // Create download with proper filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.download = `MotoPH-NMAX-Custom-${timestamp}.png`;
    link.href = dataURL;
    link.click();
    
    // Optional: Track download for analytics
    console.log('✅ Design downloaded:', { colors, timestamp });
  };

  const calculateTotal = () => {
    return selectedPartsForPurchase.reduce((total, partId) => {
      const part = PARTS_CATALOG.find(p => p.id === partId);
      return total + (part?.price || 0);
    }, 0);
  };

  const togglePartForPurchase = (partId: string) => {
    setSelectedPartsForPurchase(prev =>
      prev.includes(partId)
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
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
              title="Settings & Debug"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Debug Panel */}
      {showSettings && (
        <div className="fixed top-20 right-4 w-96 max-h-[80vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-xl p-6 z-50 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">🔧 Debug Mode</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Test Color Buttons */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold mb-2">Test: Color ALL Parts</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => testColorOnAllParts('#FF0000')}
                  className="p-3 rounded bg-red-600 hover:bg-red-700 text-xs font-bold"
                >
                  RED
                </button>
                <button
                  onClick={() => testColorOnAllParts('#00FF00')}
                  className="p-3 rounded bg-green-600 hover:bg-green-700 text-xs font-bold"
                >
                  GREEN
                </button>
                <button
                  onClick={() => testColorOnAllParts('#0000FF')}
                  className="p-3 rounded bg-blue-600 hover:bg-blue-700 text-xs font-bold"
                >
                  BLUE
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                If these work, color changing is functional!
              </p>
            </div>

            {/* Show Available Parts */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm font-semibold mb-2">
                Available Parts ({Object.keys(motorcyclePartsRef.current).length})
              </p>
              <div className="max-h-80 overflow-y-auto text-xs font-mono space-y-1 border border-gray-700 rounded p-2">
                {Object.keys(motorcyclePartsRef.current).length === 0 ? (
                  <p className="text-gray-500 italic">Model not loaded yet...</p>
                ) : (
                  Object.keys(motorcyclePartsRef.current).map((partName, idx) => (
                    <div
                      key={`${partName}-${idx}`}
                      className="p-1 bg-gray-900 rounded text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer flex items-center justify-between gap-2"
                      onClick={() => {
                        console.log('🔍 Part:', partName, motorcyclePartsRef.current[partName]);
                        // Test color this specific part
                        const mesh = motorcyclePartsRef.current[partName];
                        if (mesh && mesh.material) {
                          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                          materials.forEach((mat) => {
                            if (mat instanceof THREE.MeshStandardMaterial) {
                              mat.color.set('#FF00FF'); // Magenta to make it obvious
                              mat.needsUpdate = true;
                            }
                          });
                        }
                      }}
                    >
                      <span className="truncate">{partName}</span>
                      <span className="text-gray-500 text-[10px] shrink-0">#{idx}</span>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                ⭐ Click any part to turn it MAGENTA!
              </p>
            </div>

            {/* Console Command */}
            <div className="p-4 bg-orange-900/30 border border-orange-700 rounded-lg">
              <p className="text-xs font-semibold mb-2 text-orange-400">📋 Show All Parts:</p>
              <button
                onClick={() => {
                  const allParts = Object.keys(motorcyclePartsRef.current);
                  console.log('🔍 ALL PART NAMES:', allParts);
                  console.log('📊 Total parts:', allParts.length);
                  console.log('📝 Full list:', JSON.stringify(allParts, null, 2));
                }}
                className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-sm"
              >
                Print All Parts to Console
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Opens console (F12) and shows all {Object.keys(motorcyclePartsRef.current).length} part names
              </p>
            </div>
          </div>
        </div>
      )}

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

          {/* Parts Pricing & Shopping */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md rounded-xl p-6 border border-orange-800/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-orange-400">💰 Get This Look</h3>
              <button
                onClick={() => setShowPricing(!showPricing)}
                className="text-sm text-orange-400 hover:text-orange-300"
              >
                {showPricing ? 'Hide' : 'Show'} Prices
              </button>
            </div>

            {showPricing && (
              <div className="space-y-3">
                {PARTS_CATALOG.map((part) => {
                  const isSelected = selectedPartsForPurchase.includes(part.id);
                  const isCustomized = colors[part.id as keyof BikeColors] !== ({
                    body: '#CC0000',
                    wheels: '#1a1a1a',
                    seat: '#2a2a2a',
                    mirrors: '#C0C0C0',
                    frame: '#3a3a3a'
                  })[part.id as keyof BikeColors];

                  return (
                    <div
                      key={part.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600/20 border-orange-500'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => togglePartForPurchase(part.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {part.name}
                            {isCustomized && (
                              <span className="text-xs bg-orange-600 px-2 py-0.5 rounded-full">
                                Customized
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{part.description}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePartForPurchase(part.id)}
                          className="w-5 h-5 rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-orange-400 font-bold">₱{part.price.toLocaleString()}</span>
                        <span className="text-gray-500">{part.installTime}</span>
                      </div>
                    </div>
                  );
                })}

                {selectedPartsForPurchase.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold text-orange-400">
                        ₱{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-bold transition-all text-white shadow-lg">
                      🛒 Request Quote
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Free consultation • Install by certified mechanics
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}