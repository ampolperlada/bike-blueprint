import { BikeColors } from '@/types/bike';

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: BikeColors;
  tags: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'racing-red',
    name: 'Racing Red',
    description: 'Classic race-inspired red and black',
    colors: {
      body: '#DC0000',
      wheels: '#0A0A0A',
      seat: '#1A1A1A',
      mirrors: '#C0C0C0',
      frame: '#2A2A2A',
      exhaust: '#3A3A3A'
    },
    tags: ['sporty', 'aggressive', 'classic']
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Deep ocean blues with silver accents',
    colors: {
      body: '#0066CC',
      wheels: '#003366',
      seat: '#001F3F',
      mirrors: '#B0C4DE',
      frame: '#004080',
      exhaust: '#2A5580'
    },
    tags: ['cool', 'elegant', 'premium']
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Vibrant orange with dark contrasts',
    colors: {
      body: '#FF6B35',
      wheels: '#1A1A1A',
      seat: '#2A2A2A',
      mirrors: '#A0A0A0',
      frame: '#3A3A3A',
      exhaust: '#4A4A4A'
    },
    tags: ['bold', 'energetic', 'modern']
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Military-inspired green tones',
    colors: {
      body: '#2D5016',
      wheels: '#1C3010',
      seat: '#1A1A1A',
      mirrors: '#6B8E23',
      frame: '#253C14',
      exhaust: '#3A3A3A'
    },
    tags: ['tactical', 'rugged', 'matte']
  },
  {
    id: 'ghost-white',
    name: 'Ghost White',
    description: 'Clean white with dark accents',
    colors: {
      body: '#F8F8F8',
      wheels: '#2A2A2A',
      seat: '#1A1A1A',
      mirrors: '#E0E0E0',
      frame: '#3A3A3A',
      exhaust: '#4A4A4A'
    },
    tags: ['clean', 'minimal', 'elegant']
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Deep purple with metallic highlights',
    colors: {
      body: '#4A148C',
      wheels: '#1A1A1A',
      seat: '#2A2A2A',
      mirrors: '#9C27B0',
      frame: '#311B92',
      exhaust: '#3A3A3A'
    },
    tags: ['premium', 'unique', 'bold']
  },
  {
    id: 'stealth-black',
    name: 'Stealth Black',
    description: 'All-black tactical configuration',
    colors: {
      body: '#1A1A1A',
      wheels: '#0A0A0A',
      seat: '#0F0F0F',
      mirrors: '#2A2A2A',
      frame: '#1C1C1C',
      exhaust: '#252525'
    },
    tags: ['tactical', 'stealth', 'matte']
  },
  {
    id: 'electric-yellow',
    name: 'Electric Yellow',
    description: 'High-visibility racing yellow',
    colors: {
      body: '#FFD600',
      wheels: '#1A1A1A',
      seat: '#2A2A2A',
      mirrors: '#FFC107',
      frame: '#3A3A3A',
      exhaust: '#4A4A4A'
    },
    tags: ['racing', 'visibility', 'sporty']
  },
  {
    id: 'carbon-fiber',
    name: 'Carbon Fiber',
    description: 'Dark metallic with gunmetal accents',
    colors: {
      body: '#2C2C2C',
      wheels: '#1A1A1A',
      seat: '#1F1F1F',
      mirrors: '#707070',
      frame: '#3A3A3A',
      exhaust: '#5A5A5A'
    },
    tags: ['premium', 'subtle', 'metallic']
  },
  {
    id: 'yamaha-classic',
    name: 'Yamaha Classic',
    description: 'Iconic Yamaha blue and white',
    colors: {
      body: '#0062A5',
      wheels: '#1A1A1A',
      seat: '#0A0A0A',
      mirrors: '#C0C0C0',
      frame: '#003087',
      exhaust: '#3A3A3A'
    },
    tags: ['classic', 'brand', 'iconic']
  },
  {
    id: 'honda-red',
    name: 'Honda Red',
    description: 'Traditional Honda racing red',
    colors: {
      body: '#CC0000',
      wheels: '#1A1A1A',
      seat: '#0A0A0A',
      mirrors: '#C0C0C0',
      frame: '#B50C18',
      exhaust: '#3A3A3A'
    },
    tags: ['classic', 'brand', 'sporty']
  },
  {
    id: 'kawasaki-green',
    name: 'Kawasaki Green',
    description: 'Signature Kawasaki lime green',
    colors: {
      body: '#00B140',
      wheels: '#1A1A1A',
      seat: '#0A0A0A',
      mirrors: '#A0A0A0',
      frame: '#008C32',
      exhaust: '#3A3A3A'
    },
    tags: ['brand', 'vibrant', 'sporty']
  }
];

// Helper function to get palette by ID
export function getPaletteById(id: string): ColorPalette | undefined {
  return COLOR_PALETTES.find(p => p.id === id);
}

// Helper function to get palettes by tag
export function getPalettesByTag(tag: string): ColorPalette[] {
  return COLOR_PALETTES.filter(p => p.tags.includes(tag));
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  COLOR_PALETTES.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}