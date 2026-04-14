/**
 * NMAX 155 Parts Catalog with Philippine Pricing
 * All prices in Philippine Pesos (₱)
 */

export interface PartOption {
  id: string;
  name: string;
  price: number;
  description: string;
  availability: 'in-stock' | 'made-to-order' | 'limited';
  installTime?: string; // e.g., "2-3 hours"
}

export interface PartCategory {
  category: string;
  categoryName: string;
  options: PartOption[];
}

/**
 * Complete parts catalog with real Philippine market prices
 */
export const PARTS_CATALOG: PartCategory[] = [
  // BODY PANELS / BODY KIT
  {
    category: 'body',
    categoryName: 'Body Panels / Body Kit',
    options: [
      {
        id: 'stock',
        name: 'Stock (No Modification)',
        price: 0,
        description: 'Original NMAX body panels',
        availability: 'in-stock',
      },
      {
        id: 'repaint',
        name: 'Professional Repaint (Single Color)',
        price: 3500,
        description: 'High-quality automotive paint with clear coat',
        availability: 'made-to-order',
        installTime: '1-2 days',
      },
      {
        id: 'repaint_metallic',
        name: 'Metallic Paint Job',
        price: 5000,
        description: 'Metallic finish with pearl effect',
        availability: 'made-to-order',
        installTime: '2-3 days',
      },
      {
        id: 'basic_kit',
        name: 'Basic Body Kit',
        price: 4500,
        description: 'Front fender, side panels, rear fender',
        availability: 'in-stock',
        installTime: '3-4 hours',
      },
      {
        id: 'racing_kit',
        name: 'Racing Body Kit',
        price: 8500,
        description: 'Aggressive styling with air vents, complete set',
        availability: 'made-to-order',
        installTime: '4-5 hours',
      },
      {
        id: 'carbon_kit',
        name: 'Carbon Fiber Body Kit',
        price: 18000,
        description: 'Lightweight carbon fiber panels, premium quality',
        availability: 'limited',
        installTime: '1 day',
      },
    ],
  },

  // WHEELS / RIMS
  {
    category: 'wheels',
    categoryName: 'Wheels & Rims',
    options: [
      {
        id: 'stock',
        name: 'Stock Wheels',
        price: 0,
        description: 'Original NMAX wheels',
        availability: 'in-stock',
      },
      {
        id: 'painted',
        name: 'Custom Painted Wheels',
        price: 2000,
        description: 'Powder coating in any color',
        availability: 'made-to-order',
        installTime: '2-3 days',
      },
      {
        id: 'alloy_13',
        name: 'Alloy Rims 13" (RCB)',
        price: 6500,
        description: 'Lightweight aluminum alloy, front + rear',
        availability: 'in-stock',
        installTime: '1-2 hours',
      },
      {
        id: 'alloy_14',
        name: 'Alloy Rims 14" (Premium)',
        price: 8500,
        description: 'Forged aluminum, better handling',
        availability: 'in-stock',
        installTime: '1-2 hours',
      },
      {
        id: 'mag_racing',
        name: 'Racing Mag Wheels (Marchesini-style)',
        price: 15000,
        description: 'Ultra-light racing wheels, significant weight reduction',
        availability: 'limited',
        installTime: '2 hours',
      },
    ],
  },

  // SEAT
  {
    category: 'seat',
    categoryName: 'Seat & Comfort',
    options: [
      {
        id: 'stock',
        name: 'Stock Seat',
        price: 0,
        description: 'Original NMAX seat',
        availability: 'in-stock',
      },
      {
        id: 'cover',
        name: 'Custom Seat Cover',
        price: 1200,
        description: 'Leather-like material, various colors',
        availability: 'in-stock',
        installTime: '30 minutes',
      },
      {
        id: 'gel',
        name: 'Gel Comfort Seat',
        price: 2500,
        description: 'Memory foam + gel padding for long rides',
        availability: 'made-to-order',
        installTime: '1 hour',
      },
      {
        id: 'racing',
        name: 'Racing Seat (Low Profile)',
        price: 4500,
        description: 'Aggressive riding position, grippy material',
        availability: 'made-to-order',
        installTime: '1 hour',
      },
      {
        id: 'dual_tone',
        name: 'Dual-Tone Premium Seat',
        price: 3500,
        description: 'Two-color design with contrast stitching',
        availability: 'made-to-order',
        installTime: '1 hour',
      },
    ],
  },

  // MIRRORS
  {
    category: 'mirrors',
    categoryName: 'Mirrors',
    options: [
      {
        id: 'stock',
        name: 'Stock Mirrors',
        price: 0,
        description: 'Original NMAX mirrors',
        availability: 'in-stock',
      },
      {
        id: 'bar_end',
        name: 'Bar-End Mirrors',
        price: 800,
        description: 'Sleek minimalist look, universal fit',
        availability: 'in-stock',
        installTime: '15 minutes',
      },
      {
        id: 'rizoma',
        name: 'Rizoma-Style Mirrors',
        price: 1800,
        description: 'Premium Italian-style design, better visibility',
        availability: 'in-stock',
        installTime: '20 minutes',
      },
      {
        id: 'carbon',
        name: 'Carbon Fiber Mirrors',
        price: 3500,
        description: 'Lightweight carbon with wide-angle glass',
        availability: 'limited',
        installTime: '20 minutes',
      },
    ],
  },

  // FRAME / CHASSIS
  {
    category: 'frame',
    categoryName: 'Frame Sliders & Protection',
    options: [
      {
        id: 'stock',
        name: 'No Protection',
        price: 0,
        description: 'Stock frame without sliders',
        availability: 'in-stock',
      },
      {
        id: 'basic_sliders',
        name: 'Basic Frame Sliders',
        price: 1500,
        description: 'Crash protection for low-speed drops',
        availability: 'in-stock',
        installTime: '1 hour',
      },
      {
        id: 'racing_sliders',
        name: 'Racing Frame Sliders (CNC)',
        price: 3500,
        description: 'Heavy-duty aluminum, better protection',
        availability: 'in-stock',
        installTime: '1-2 hours',
      },
      {
        id: 'full_protection',
        name: 'Full Protection Kit',
        price: 6500,
        description: 'Frame sliders + engine guards + fork protectors',
        availability: 'made-to-order',
        installTime: '2-3 hours',
      },
    ],
  },

  // EXHAUST
  {
    category: 'exhaust',
    categoryName: 'Exhaust System',
    options: [
      {
        id: 'stock',
        name: 'Stock Exhaust',
        price: 0,
        description: 'Original NMAX muffler',
        availability: 'in-stock',
      },
      {
        id: 'aftermarket',
        name: 'Aftermarket Slip-On',
        price: 2500,
        description: 'Better sound, slight performance gain',
        availability: 'in-stock',
        installTime: '30 minutes',
      },
      {
        id: 'racing',
        name: 'Racing Exhaust (Full System)',
        price: 8500,
        description: 'Stainless steel, +2-3HP, aggressive sound',
        availability: 'in-stock',
        installTime: '2 hours',
      },
      {
        id: 'akrapovic',
        name: 'Akrapovic Slip-On',
        price: 15000,
        description: 'Premium titanium, weight reduction, EU-approved',
        availability: 'limited',
        installTime: '1 hour',
      },
      {
        id: 'two_brothers',
        name: 'Two Brothers Racing Full System',
        price: 22000,
        description: 'Competition-grade, max performance',
        availability: 'limited',
        installTime: '3 hours',
      },
    ],
  },
];

/**
 * Get part option by category and ID
 */
export function getPartOption(category: string, optionId: string): PartOption | undefined {
  const cat = PARTS_CATALOG.find(c => c.category === category);
  return cat?.options.find(opt => opt.id === optionId);
}

/**
 * Calculate total price from user selections
 */
export function calculateTotalPrice(selections: Record<string, string>): number {
  let total = 0;
  
  Object.entries(selections).forEach(([category, optionId]) => {
    const option = getPartOption(category, optionId);
    if (option) {
      total += option.price;
    }
  });
  
  return total;
}

/**
 * Get installation time estimate
 */
export function getInstallationTime(selections: Record<string, string>): string {
  const times: string[] = [];
  
  Object.entries(selections).forEach(([category, optionId]) => {
    const option = getPartOption(category, optionId);
    if (option?.installTime && option.id !== 'stock') {
      times.push(option.installTime);
    }
  });
  
  if (times.length === 0) return 'No installation needed';
  if (times.length === 1) return times[0];
  return '1-2 days (full build)';
}

/**
 * Preset builds for quick selection
 */
export const PRESET_BUILDS = {
  budget: {
    name: 'Budget Build',
    description: 'Pang-araw-araw, matipid pero malinis',
    total: 4200,
    selections: {
      body: 'repaint',
      wheels: 'painted',
      seat: 'cover',
      mirrors: 'stock',
      frame: 'stock',
      exhaust: 'stock',
    },
  },
  clean_daily: {
    name: 'Clean Daily Build',
    description: 'Simple, elegant, perfect for everyday',
    total: 8700,
    selections: {
      body: 'repaint_metallic',
      wheels: 'painted',
      seat: 'cover',
      mirrors: 'bar_end',
      frame: 'basic_sliders',
      exhaust: 'stock',
    },
  },
  racing_look: {
    name: 'Racing Look',
    description: 'Sporty vibes, may dating',
    total: 24500,
    selections: {
      body: 'racing_kit',
      wheels: 'alloy_14',
      seat: 'racing',
      mirrors: 'rizoma',
      frame: 'racing_sliders',
      exhaust: 'racing',
    },
  },
  all_black: {
    name: 'All Black Stealth',
    description: 'Murdered out, puro itim',
    total: 12000,
    selections: {
      body: 'repaint', // Black color
      wheels: 'painted', // Black
      seat: 'dual_tone', // Black with gray
      mirrors: 'bar_end', // Black
      frame: 'racing_sliders', // Black
      exhaust: 'aftermarket', // Black tip
    },
  },
  premium_build: {
    name: 'Premium Build',
    description: 'Best of the best, walang tawad',
    total: 52000,
    selections: {
      body: 'carbon_kit',
      wheels: 'mag_racing',
      seat: 'racing',
      mirrors: 'carbon',
      frame: 'full_protection',
      exhaust: 'akrapovic',
    },
  },
};