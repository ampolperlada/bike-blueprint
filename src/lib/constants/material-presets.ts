import * as THREE from 'three';

/**
 * Material finish types
 */
export type MaterialFinish = 'matte' | 'gloss' | 'metallic' | 'chrome' | 'carbon';

/**
 * Material properties for different finishes
 */
export interface MaterialPreset {
  id: MaterialFinish;
  name: string;
  description: string;
  properties: {
    metalness: number;
    roughness: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    envMapIntensity?: number;
  };
  icon: string;
}

/**
 * Available material presets
 */
export const MATERIAL_PRESETS: Record<MaterialFinish, MaterialPreset> = {
  matte: {
    id: 'matte',
    name: 'Matte',
    description: 'Flat, non-reflective finish',
    properties: {
      metalness: 0,
      roughness: 1,
      envMapIntensity: 0.3,
    },
    icon: '⬜',
  },
  gloss: {
    id: 'gloss',
    name: 'Gloss',
    description: 'Shiny paint finish',
    properties: {
      metalness: 0,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.8,
    },
    icon: '✨',
  },
  metallic: {
    id: 'metallic',
    name: 'Metallic',
    description: 'Metal flake paint',
    properties: {
      metalness: 0.6,
      roughness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1,
    },
    icon: '🔷',
  },
  chrome: {
    id: 'chrome',
    name: 'Chrome',
    description: 'Mirror-like reflective',
    properties: {
      metalness: 1,
      roughness: 0,
      envMapIntensity: 2,
    },
    icon: '🪞',
  },
  carbon: {
    id: 'carbon',
    name: 'Carbon Fiber',
    description: 'Matte with subtle texture',
    properties: {
      metalness: 0.1,
      roughness: 0.6,
      envMapIntensity: 0.5,
    },
    icon: '⬛',
  },
};

/**
 * Apply material preset to a mesh
 */
export function applyMaterialPreset(
  mesh: THREE.Mesh,
  preset: MaterialFinish,
  preserveColor: boolean = true
) {
  const material = mesh.material as THREE.MeshStandardMaterial;
  if (!material) return;

  // Store current color
  const currentColor = preserveColor ? material.color.clone() : null;

  // Apply preset properties
  const presetData = MATERIAL_PRESETS[preset];
  material.metalness = presetData.properties.metalness;
  material.roughness = presetData.properties.roughness;

  // Apply clearcoat if material supports it (MeshPhysicalMaterial)
  if ('clearcoat' in material && presetData.properties.clearcoat !== undefined) {
    (material as any).clearcoat = presetData.properties.clearcoat;
    (material as any).clearcoatRoughness = presetData.properties.clearcoatRoughness || 0;
  }

  // Environment map intensity
  if ('envMapIntensity' in material && presetData.properties.envMapIntensity !== undefined) {
    material.envMapIntensity = presetData.properties.envMapIntensity;
  }

  // Restore color if needed
  if (currentColor) {
    material.color.copy(currentColor);
  }

  material.needsUpdate = true;
}

/**
 * Get material finish from mesh
 */
export function getMaterialFinish(mesh: THREE.Mesh): MaterialFinish {
  const material = mesh.material as THREE.MeshStandardMaterial;
  
  // Chrome detection
  if (material.metalness === 1 && material.roughness === 0) {
    return 'chrome';
  }
  
  // Metallic detection
  if (material.metalness > 0.4) {
    return 'metallic';
  }
  
  // Gloss detection (clearcoat)
  if ('clearcoat' in material && (material as any).clearcoat > 0.5) {
    return 'gloss';
  }
  
  // Carbon detection
  if (material.metalness < 0.2 && material.roughness > 0.5 && material.roughness < 0.7) {
    return 'carbon';
  }
  
  // Default to matte
  return 'matte';
}

/**
 * Create material preview sphere
 */
export function createMaterialPreview(
  preset: MaterialFinish,
  color: string = '#808080',
  size: number = 1
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
  });

  const mesh = new THREE.Mesh(geometry, material);
  applyMaterialPreset(mesh, preset, true);

  return mesh;
}