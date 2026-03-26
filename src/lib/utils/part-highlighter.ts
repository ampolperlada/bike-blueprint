import * as THREE from 'three';
import { PartType } from '@/types/parts';

/**
 * Highlight state for a mesh
 */
interface HighlightState {
  mesh: THREE.Mesh;
  originalEmissive: THREE.Color;
  originalEmissiveIntensity: number;
}

/**
 * Part highlighting manager
 */
export class PartHighlighter {
  private highlightedParts: Map<string, HighlightState> = new Map();
  private selectedParts: Map<string, HighlightState> = new Map();
  private animationFrame: number | null = null;

  /**
   * Highlight a part on hover
   */
  highlightPart(mesh: THREE.Mesh, partType: PartType) {
    if (this.highlightedParts.has(mesh.uuid)) return;

    const material = mesh.material as THREE.MeshStandardMaterial;
    
    // Store original emissive
    const state: HighlightState = {
      mesh,
      originalEmissive: material.emissive.clone(),
      originalEmissiveIntensity: material.emissiveIntensity,
    };

    // Apply highlight glow
    material.emissive.set(0x007ACC); // Blue glow
    material.emissiveIntensity = 0.3;

    this.highlightedParts.set(mesh.uuid, state);
  }

  /**
   * Remove hover highlight
   */
  unhighlightPart(mesh: THREE.Mesh) {
    const state = this.highlightedParts.get(mesh.uuid);
    if (!state) return;

    const material = mesh.material as THREE.MeshStandardMaterial;
    
    // Restore original emissive
    material.emissive.copy(state.originalEmissive);
    material.emissiveIntensity = state.originalEmissiveIntensity;

    this.highlightedParts.delete(mesh.uuid);
  }

  /**
   * Select a part (stronger highlight with pulse)
   */
  selectPart(mesh: THREE.Mesh, partType: PartType) {
    // Clear previous selection
    this.clearSelection();

    const material = mesh.material as THREE.MeshStandardMaterial;
    
    const state: HighlightState = {
      mesh,
      originalEmissive: material.emissive.clone(),
      originalEmissiveIntensity: material.emissiveIntensity,
    };

    this.selectedParts.set(mesh.uuid, state);
    
    // Start pulse animation
    this.startPulseAnimation();
  }

  /**
   * Clear all selections
   */
  clearSelection() {
    this.selectedParts.forEach((state) => {
      const material = state.mesh.material as THREE.MeshStandardMaterial;
      material.emissive.copy(state.originalEmissive);
      material.emissiveIntensity = state.originalEmissiveIntensity;
    });
    this.selectedParts.clear();
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Pulse animation for selected parts
   */
  private startPulseAnimation() {
    if (this.animationFrame) return;

    const pulse = () => {
      const time = Date.now() * 0.003; // Slow pulse
      const intensity = 0.2 + Math.sin(time) * 0.15; // 0.05 to 0.35

      this.selectedParts.forEach((state) => {
        const material = state.mesh.material as THREE.MeshStandardMaterial;
        material.emissive.set(0x007ACC);
        material.emissiveIntensity = intensity;
      });

      this.animationFrame = requestAnimationFrame(pulse);
    };

    pulse();
  }

  /**
   * Highlight parts by type (from sidebar hover)
   */
  highlightPartsByType(
    motorcycleParts: Record<string, THREE.Mesh>,
    partType: PartType
  ) {
    Object.entries(motorcycleParts).forEach(([key, mesh]) => {
      if (key.startsWith(partType)) {
        this.highlightPart(mesh, partType);
      }
    });
  }

  /**
   * Unhighlight parts by type
   */
  unhighlightPartsByType(
    motorcycleParts: Record<string, THREE.Mesh>,
    partType: PartType
  ) {
    Object.entries(motorcycleParts).forEach(([key, mesh]) => {
      if (key.startsWith(partType)) {
        this.unhighlightPart(mesh);
      }
    });
  }

  /**
   * Select parts by type
   */
  selectPartsByType(
    motorcycleParts: Record<string, THREE.Mesh>,
    partType: PartType
  ) {
    // Clear previous
    this.clearSelection();

    // Select all matching parts
    Object.entries(motorcycleParts).forEach(([key, mesh]) => {
      if (key.startsWith(partType)) {
        this.selectPart(mesh, partType);
      }
    });
  }

  /**
   * Cleanup
   */
  dispose() {
    this.clearSelection();
    this.highlightedParts.clear();
  }
}

// Global instance
export const partHighlighter = new PartHighlighter();