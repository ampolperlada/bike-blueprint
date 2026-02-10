export interface PerformanceImpact {
  acceleration: number;  // -3 to +3 scale
  handling: number;      // -3 to +3 scale
  sound: number;         // 0 to 3 (quiet to very loud)
  weight: number;        // kg difference (negative = lighter)
}

export interface PartCompatibility {
  models: string[];      // Compatible bike models
  warning?: string;      // Fitment warning (e.g., "May rub swingarm")
}

export interface Part {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  priceRange: { min: number; max: number };
  installTime: string;
  compatibility: PartCompatibility;
  performance: PerformanceImpact;
  category: 'body' | 'wheels' | 'seat' | 'mirrors' | 'frame' | 'exhaust' | 'suspension';
  imageUrl?: string;
  maintenance?: string;  // Care instructions
}

export interface PresetColor {
  name: string;
  hex: string;  
  category: 'brand' | 'matte' | 'metallic' | 'vibrant' | 'classic' | 'pastel';
}

export type PartType = 'body' | 'wheels' | 'seat' | 'mirrors' | 'frame' | 'exhaust';