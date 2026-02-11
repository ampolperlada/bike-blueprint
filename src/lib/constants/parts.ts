import { Part } from '@/types/parts';

export const MOTORCYCLE_PARTS_CATALOG: Part[] = [
  {
    id: 'body',
    name: 'Full Fairing Kit',
    brand: 'OEM Quality',
    model: 'Complete Body Set',
    description: 'Professional-grade ABS plastic with UV protection',
    price: 8500,
    priceRange: { min: 7500, max: 9500 },
    installTime: '2-3 hours',
    category: 'body',
    compatibility: {
      models: ['NMAX 155', 'NMAX 2020+', 'NMAX V2'],
    },
    performance: {
      acceleration: 0,
      handling: 0,
      sound: 0,
      weight: 0
    },
    maintenance: 'Wash with soap and water. Avoid harsh chemicals on matte finishes.'
  },
  {
    id: 'wheels',
    name: 'RCB Mags 13"',
    brand: 'RCB Racing',
    model: 'Forged Aluminum SP-13',
    description: 'Lightweight forged aluminum alloy wheels (front + rear)',
    price: 6500,
    priceRange: { min: 6000, max: 7200 },
    installTime: '1 hour',
    category: 'wheels',
    compatibility: {
      models: ['NMAX 155', 'Click 125', 'PCX 150', 'Aerox 155'],
    },
    performance: {
      acceleration: 1,
      handling: 2,
      sound: 0,
      weight: -1.5
    },
    maintenance: 'Check spoke tension monthly. Lighter wheels improve fuel efficiency by ~3%.'
  },
  {
    id: 'seat',
    name: 'Diamond Stitch Seat',
    brand: 'Premium Leather Co.',
    model: 'Executive Diamond Pattern',
    description: 'Genuine leather with diamond stitching and memory foam',
    price: 1800,
    priceRange: { min: 1500, max: 2200 },
    installTime: '30 mins',
    category: 'seat',
    compatibility: {
      models: ['NMAX 155', 'NMAX 2018+'],
    },
    performance: {
      acceleration: 0,
      handling: 0,
      sound: 0,
      weight: 0.3
    },
    maintenance: 'Apply leather conditioner every 3 months. Avoid direct sunlight when parked.'
  },
  {
    id: 'mirrors',
    name: 'Stealth GT Mirrors',
    brand: 'Rizoma',
    model: 'Spy-R BS124',
    description: 'CNC-machined aluminum with integrated LED turn signals',
    price: 2800,
    priceRange: { min: 2500, max: 3200 },
    installTime: '15 mins',
    category: 'mirrors',
    compatibility: {
      models: ['Universal - M10 thread'],
    },
    performance: {
      acceleration: 0,
      handling: 1,
      sound: 0,
      weight: -0.3
    },
    maintenance: 'Aerodynamic design reduces wind resistance. Clean glass with microfiber cloth.'
  },
  {
    id: 'frame',
    name: 'Frame Coating Kit',
    brand: 'Bosny Professional',
    model: 'High-Temp Ceramic Coat',
    description: 'Heat-resistant ceramic coating for frame and swingarm',
    price: 3500,
    priceRange: { min: 3000, max: 4000 },
    installTime: '4 hours',
    category: 'frame',
    compatibility: {
      models: ['NMAX 155', 'All models'],
    },
    performance: {
      acceleration: 0,
      handling: 0,
      sound: 0,
      weight: 0.5
    },
    maintenance: 'Protects against rust and heat damage. Lasts 2-3 years with proper care.'
  },
  {
    id: 'exhaust',
    name: 'Racing Exhaust',
    brand: 'Akrapovic',
    model: 'Slip-On Carbon',
    description: 'Full carbon fiber slip-on with dB killer',
    price: 12500,
    priceRange: { min: 11000, max: 14000 },
    installTime: '1 hour',
    category: 'exhaust',
    compatibility: {
      models: ['NMAX 155', 'NMAX 2020+'],
      warning: '⚠ May be too loud for residential areas. Check local noise regulations.'
    },
    performance: {
      acceleration: 2,
      handling: 0,
      sound: 3,
      weight: -2.1
    },
    maintenance: 'Carbon fiber requires no maintenance. Sound level: 98dB with dB killer, 105dB without.'
  }
];

export const MOTORCYCLE_PART_TYPES = [
  { id: 'body' as const, label: 'Body Panels', description: 'Main fairings', icon: '🏍️' },
  { id: 'wheels' as const, label: 'Wheels', description: 'Rims & tires', icon: '⚙️' },
  { id: 'seat' as const, label: 'Seat', description: 'Saddle cover', icon: '💺' },
  { id: 'mirrors' as const, label: 'Mirrors', description: 'Side mirrors', icon: '🪞' },
  { id: 'frame' as const, label: 'Frame', description: 'Chassis', icon: '🔩' },
  { id: 'exhaust' as const, label: 'Exhaust', description: 'Muffler system', icon: '💨' }
];