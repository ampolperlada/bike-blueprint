import { PresetColor } from '@/types/parts';

export const PRESET_COLORS: PresetColor[] = [
  // Yamaha Brand Colors
  { name: 'Yamaha Blue', hex: '#0062A5', category: 'brand' },
  { name: 'Yamaha Racing Blue', hex: '#003087', category: 'brand' },
  { name: 'Yamaha Red', hex: '#D31245', category: 'brand' },
  
  // Honda Brand Colors
  { name: 'Honda Red', hex: '#CC0000', category: 'brand' },
  { name: 'Honda Victory Red', hex: '#B50C18', category: 'brand' },
  { name: 'Honda Pearl White', hex: '#F8F8F8', category: 'brand' },
  
  // Matte Colors (Trending in PH)
  { name: 'Matte Black', hex: '#1C1C1C', category: 'matte' },
  { name: 'Matte Gray', hex: '#4A4A4A', category: 'matte' },
  { name: 'Matte Army Green', hex: '#50563A', category: 'matte' },
  { name: 'Matte Navy Blue', hex: '#1B2B3A', category: 'matte' },
  
  // Metallic Colors
  { name: 'Gunmetal Gray', hex: '#2C3539', category: 'metallic' },
  { name: 'Silver Metallic', hex: '#BFC1C2', category: 'metallic' },
  { name: 'Gold Metallic', hex: '#D4AF37', category: 'metallic' },
  { name: 'Bronze Metallic', hex: '#CD7F32', category: 'metallic' },
  
  // Vibrant Colors (Popular for custom builds)
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