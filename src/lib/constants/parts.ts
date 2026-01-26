export const MOTORCYCLE_PARTS = [
  { 
    id: 'body', 
    label: 'Body Panels', 
    icon: '🏍️',
    description: 'Main body fairings and side panels'
  },
  { 
    id: 'wheels', 
    label: 'Wheels/Rims', 
    icon: '⚙️',
    description: 'Front and rear wheel colors'
  },
  { 
    id: 'seat', 
    label: 'Seat', 
    icon: '💺',
    description: 'Seat cover and padding'
  },
  { 
    id: 'mirrors', 
    label: 'Mirrors', 
    icon: '🪞',
    description: 'Side mirrors'
  },
  { 
    id: 'frame', 
    label: 'Frame', 
    icon: '🔩',
    description: 'Metal frame and chassis'
  }
] as const;

export type PartId = typeof MOTORCYCLE_PARTS[number]['id'];