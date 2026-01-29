// FILE: src/components/customizer/ModelLoader.tsx
// This component loads the real NMAX 3D model

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ModelLoaderProps {
  colors: {
    body: string;
    wheels: string;
    seat: string;
    mirrors: string;
    frame: string;
  };
  onModelLoaded: (parts: Record<string, THREE.Mesh>) => void;
}

export function useModelLoader(scene: THREE.Scene, colors: ModelLoaderProps['colors']) {
  const motorcyclePartsRef = useRef<Record<string, THREE.Mesh>>({});

  useEffect(() => {
    if (!scene) return;

    const loader = new GLTFLoader();
    
    // Load the NMAX model
    loader.load(
      '/models/nmax.gltf', // Your downloaded model
      (gltf) => {
        const model = gltf.scene;
        
        // Scale and position the model
        model.scale.set(1, 1, 1);
        model.position.set(0, -1, 0);
        
        // Enable shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Find parts by name (you'll need to inspect your model to find the correct names)
        // Common names: 'body', 'Body', 'fairings', 'panel', 'wheel', 'seat', etc.
        const parts: Record<string, THREE.Mesh> = {};
        
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const name = child.name.toLowerCase();
            
            // Body parts
            if (name.includes('body') || name.includes('fairing') || name.includes('panel')) {
              child.material = new THREE.MeshStandardMaterial({
                color: colors.body,
                metalness: 0.5,
                roughness: 0.3
              });
              parts[`body_${child.name}`] = child;
            }
            
            // Wheels
            if (name.includes('wheel') || name.includes('rim')) {
              child.material = new THREE.MeshStandardMaterial({
                color: colors.wheels,
                metalness: 0.6,
                roughness: 0.4
              });
              parts[`wheel_${child.name}`] = child;
            }
            
            // Seat
            if (name.includes('seat')) {
              child.material = new THREE.MeshStandardMaterial({
                color: colors.seat,
                roughness: 0.8,
                metalness: 0.1
              });
              parts[`seat_${child.name}`] = child;
            }
            
            // Mirrors
            if (name.includes('mirror')) {
              child.material = new THREE.MeshStandardMaterial({
                color: colors.mirrors,
                metalness: 0.9,
                roughness: 0.1
              });
              parts[`mirror_${child.name}`] = child;
            }
            
            // Frame
            if (name.includes('frame') || name.includes('chassis')) {
              child.material = new THREE.MeshStandardMaterial({
                color: colors.frame,
                metalness: 0.8,
                roughness: 0.3
              });
              parts[`frame_${child.name}`] = child;
            }
          }
        });

        motorcyclePartsRef.current = parts;
        scene.add(model);
        
        console.log('Model loaded! Available parts:', Object.keys(parts));
      },
      (progress) => {
        console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        alert('Failed to load 3D model. Make sure nmax.gltf is in public/models/ folder');
      }
    );
  }, [scene]);

  return motorcyclePartsRef.current;
}