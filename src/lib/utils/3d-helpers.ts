import * as THREE from 'three';

export function applyColorToMesh(
  mesh: THREE.Mesh | undefined,
  color: string
): boolean {
  if (!mesh || !mesh.material) return false;
  
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  let applied = false;
  
  materials.forEach((mat) => {
    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
      mat.color.set(color);
      mat.needsUpdate = true;
      applied = true;
    }
  });
  
  return applied;
}

export function detectPartType(meshName: string): string | null {
  const name = meshName.toLowerCase();
  
  // Body/Fairing detection
  if (name.includes('body') || name.includes('fairing') || name.includes('panel') ||
      name.includes('cowl') || name.includes('cover') || name.includes('side')) {
    return 'body';
  }
  
  // Wheel detection
  if (name.includes('wheel') || name.includes('rim') || name.includes('tire') || name.includes('mag')) {
    return 'wheels';
  }
  
  // Seat detection
  if (name.includes('seat') || name.includes('saddle') || name.includes('cushion')) {
    return 'seat';
  }
  
  // Mirror detection
  if (name.includes('mirror') || name.includes('rearview')) {
    return 'mirrors';
  }
  
  // Frame detection
  if (name.includes('frame') || name.includes('chassis') || name.includes('fork') ||
      name.includes('swingarm') || name.includes('structure')) {
    return 'frame';
  }
  
  return null;
}

export function enhanceMaterial(material: THREE.Material): void {
  if (material instanceof THREE.MeshStandardMaterial) {
    material.envMapIntensity = 1.5;
    material.roughness = Math.min(material.roughness, 0.6);
    material.metalness = Math.max(material.metalness, 0.3);
    material.needsUpdate = true;
  }
}

export function calculateModelBounds(model: THREE.Object3D): {
  box: THREE.Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
} {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  return { box, size, center };
}

export function centerAndScaleModel(
  model: THREE.Object3D,
  targetHeight: number = 3
): { scale: number; position: THREE.Vector3 } {
  const { size, center } = calculateModelBounds(model);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetHeight / maxDim;
  
  const position = new THREE.Vector3(
    -center.x * scale,
    -center.y * scale + 0.8,
    -center.z * scale
  );
  
  return { scale, position };
}