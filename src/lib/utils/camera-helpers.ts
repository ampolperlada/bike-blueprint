import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Calculate bounding box of a 3D object
 */
export function calculateBoundingBox(object: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  box.setFromObject(object);
  return box;
}

/**
 * Auto-fit camera to model with proper framing
 */
export function fitCameraToModel(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  model: THREE.Object3D,
  options: {
    offset?: number; // Extra space around model (default 1.5)
    centerY?: number; // Y-axis center point (default: model center)
  } = {}
) {
  const { offset = 1.5, centerY } = options;

  // Calculate model bounding box
  const box = calculateBoundingBox(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Use custom Y center if provided
  if (centerY !== undefined) {
    center.y = centerY;
  }

  // Calculate optimal distance
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * offset;

  // Set camera position (slightly elevated angle)
  camera.position.set(
    cameraZ * 0.7,  // X: Slight angle
    cameraZ * 0.5,  // Y: Elevated view
    cameraZ         // Z: Main distance
  );

  // Point camera at model center
  controls.target.copy(center);
  controls.update();

  // Adjust near/far planes
  camera.near = cameraZ / 100;
  camera.far = cameraZ * 100;
  camera.updateProjectionMatrix();
}

/**
 * Smooth camera animation to target
 */
export function animateCameraTo(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  targetPosition: THREE.Vector3,
  targetLookAt: THREE.Vector3,
  duration: number = 1000
): Promise<void> {
  return new Promise((resolve) => {
    const startPosition = camera.position.clone();
    const startLookAt = controls.target.clone();
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out function
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Interpolate position
      camera.position.lerpVectors(startPosition, targetPosition, eased);
      controls.target.lerpVectors(startLookAt, targetLookAt, eased);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    animate();
  });
}

/**
 * Preset camera angles for quick views
 */
export const CAMERA_PRESETS = {
  front: { position: [0, 1.5, 4], target: [0, 0.8, 0] },
  side: { position: [4, 1.5, 0], target: [0, 0.8, 0] },
  top: { position: [0, 5, 0], target: [0, 0, 0] },
  three_quarter: { position: [2.5, 1.8, 3], target: [0, 0.8, 0] },
  detail: { position: [1, 1, 1.5], target: [0, 0.8, 0] },
} as const;

/**
 * Apply camera preset
 */
export function applyCameraPreset(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  preset: keyof typeof CAMERA_PRESETS,
  animate: boolean = true
) {
  const { position, target } = CAMERA_PRESETS[preset];
  const targetPos = new THREE.Vector3(...position);
  const targetLookAt = new THREE.Vector3(...target);

  if (animate) {
    return animateCameraTo(camera, controls, targetPos, targetLookAt, 800);
  } else {
    camera.position.set(...position);
    controls.target.set(...target);
    controls.update();
    return Promise.resolve();
  }
}