'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw, Palette, Maximize2, Info, Sparkles } from 'lucide-react';
import * as THREE from 'three';
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

    // Build motorcycle
    const motorcycleParts: Record<string, THREE.Mesh> = {};

    // WHEELS
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: colors.wheels,
      metalness: 0.6,
      roughness: 0.4
    });

    // Front wheel
    const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial.clone());
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(1.5, -0.4, 0);
    frontWheel.castShadow = true;
    scene.add(frontWheel);
    motorcycleParts.frontWheel = frontWheel;

    // Rear wheel
    const rearWheel = new THREE.Mesh(wheelGeometry, wheelMaterial.clone());
    rearWheel.rotation.z = Math.PI / 2;
    rearWheel.position.set(-1.2, -0.4, 0);
    rearWheel.castShadow = true;
    scene.add(rearWheel);
    motorcycleParts.rearWheel = rearWheel;

    // Wheel spokes
    const spokeGeometry = new THREE.BoxGeometry(0.02, 0.7, 0.02);
    const spokeMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    
    [frontWheel, rearWheel].forEach(wheel => {
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
        spoke.position.y = Math.cos(angle) * 0.35;
        spoke.position.z = Math.sin(angle) * 0.35;
        spoke.rotation.z = angle;
        wheel.add(spoke);
      }
    });

    // FRAME
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: colors.frame,
      metalness: 0.8,
      roughness: 0.3
    });

    const frameGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 16);
    const mainFrame = new THREE.Mesh(frameGeometry, frameMaterial.clone());
    mainFrame.rotation.z = Math.PI / 6;
    mainFrame.position.set(0, 0, 0);
    mainFrame.castShadow = true;
    scene.add(mainFrame);
    motorcycleParts.mainFrame = mainFrame;

    // BODY PANELS
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: colors.body,
      metalness: 0.5,
      roughness: 0.3
    });

    // Front fairing
    const frontFairingGeometry = new THREE.BoxGeometry(0.6, 1, 0.8);
    const frontFairing = new THREE.Mesh(frontFairingGeometry, bodyMaterial.clone());
    frontFairing.position.set(1.8, 0.2, 0);
    frontFairing.castShadow = true;
    scene.add(frontFairing);
    motorcycleParts.frontFairing = frontFairing;

    // Side panels
    const sidePanelGeometry = new THREE.BoxGeometry(2, 0.6, 0.05);
    const leftPanel = new THREE.Mesh(sidePanelGeometry, bodyMaterial.clone());
    leftPanel.position.set(0, 0, 0.5);
    leftPanel.castShadow = true;
    scene.add(leftPanel);
    motorcycleParts.leftPanel = leftPanel;

    const rightPanel = new THREE.Mesh(sidePanelGeometry, bodyMaterial.clone());
    rightPanel.position.set(0, 0, -0.5);
    rightPanel.castShadow = true;
    scene.add(rightPanel);
    motorcycleParts.rightPanel = rightPanel;

    // Rear panel
    const rearPanelGeometry = new THREE.BoxGeometry(0.8, 0.8, 1);
    const rearPanel = new THREE.Mesh(rearPanelGeometry, bodyMaterial.clone());
    rearPanel.position.set(-1.5, 0.3, 0);
    rearPanel.castShadow = true;
    scene.add(rearPanel);
    motorcycleParts.rearPanel = rearPanel;

    // SEAT
    const seatGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.6);
    const seatMaterial = new THREE.MeshStandardMaterial({
      color: colors.seat,
      roughness: 0.8,
      metalness: 0.1
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.set(-0.3, 0.7, 0);
    seat.castShadow = true;
    scene.add(seat);
    motorcycleParts.seat = seat;

    // MIRRORS
    const mirrorMaterial = new THREE.MeshStandardMaterial({
      color: colors.mirrors,
      metalness: 0.9,
      roughness: 0.1
    });

    const mirrorArmGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    
    // Left mirror
    const leftMirrorArm = new THREE.Mesh(mirrorArmGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    leftMirrorArm.position.set(2, 0.8, 0.3);
    leftMirrorArm.rotation.z = -Math.PI / 4;
    scene.add(leftMirrorArm);

    const leftMirrorGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.02);
    const leftMirror = new THREE.Mesh(leftMirrorGeometry, mirrorMaterial.clone());
    leftMirror.position.set(2.3, 1.1, 0.3);
    leftMirror.castShadow = true;
    scene.add(leftMirror);
    motorcycleParts.leftMirror = leftMirror;

    // Right mirror
    const rightMirrorArm = new THREE.Mesh(mirrorArmGeometry, new THREE.MeshStandardMaterial({ color: 0x333333 }));
    rightMirrorArm.position.set(2, 0.8, -0.3);
    rightMirrorArm.rotation.z = -Math.PI / 4;
    scene.add(rightMirrorArm);

    const rightMirrorGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.02);
    const rightMirror = new THREE.Mesh(rightMirrorGeometry, mirrorMaterial.clone());
    rightMirror.position.set(2.3, 1.1, -0.3);
    rightMirror.castShadow = true;
    scene.add(rightMirror);
    motorcycleParts.rightMirror = rightMirror;

    // Headlight
    const headlightGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffcc,
      emissive: 0xffff99,
      emissiveIntensity: 0.5
    });
    const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight.position.set(2.1, 0.3, 0);
    scene.add(headlight);

    // Exhaust
    const exhaustGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 16);
    const exhaustMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      metalness: 0.7,
      roughness: 0.4
    });
    const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.set(-1.5, -0.3, -0.4);
    exhaust.castShadow = true;
    scene.add(exhaust);

    motorcyclePartsRef.current = motorcycleParts;
    setIsLoading(false);

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

    // Body parts
    if (parts.frontFairing) parts.frontFairing.material.color.setStyle(colors.body);
    if (parts.leftPanel) parts.leftPanel.material.color.setStyle(colors.body);
    if (parts.rightPanel) parts.rightPanel.material.color.setStyle(colors.body);
    if (parts.rearPanel) parts.rearPanel.material.color.setStyle(colors.body);

    // Wheels
    if (parts.frontWheel) parts.frontWheel.material.color.setStyle(colors.wheels);
    if (parts.rearWheel) parts.rearWheel.material.color.setStyle(colors.wheels);

    // Seat
    if (parts.seat) parts.seat.material.color.setStyle(colors.seat);

    // Mirrors
    if (parts.leftMirror) parts.leftMirror.material.color.setStyle(colors.mirrors);
    if (parts.rightMirror) parts.rightMirror.material.color.setStyle(colors.mirrors);

    // Frame
    if (parts.mainFrame) parts.mainFrame.material.color.setStyle(colors.frame);
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
    link.download = 'my-custom-motorcycle-3d.png';
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
          <p className="text-gray-400 text-lg">Rotate, customize, and see your bike in full 3D!</p>
          <p className="text-yellow-400 text-sm mt-2">✨ Drag to rotate • Mobile friendly</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden" style={{ height: '500px' }}>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="text-center">
                      <div className="animate-spin text-6xl mb-4">🏍️</div>
                      <p className="text-gray-600">Loading 3D Model...</p>
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

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Part Selection */}
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
                💡 Next: Real NMAX 3D model coming soon!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Built with Three.js • Created by Christian Paul Perlada</p>
          <p className="mt-2">3D Prototype - Ready for production! 🎨</p>
        </div>
      </div>
    </div>
  );
}