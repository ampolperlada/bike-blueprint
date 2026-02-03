export interface BikeColors {
  body: string;
  wheels: string;
  seat: string;
  mirrors: string;
  frame: string;
}

export interface BikeDesign {
  id?: string;
  userId?: string;
  name: string;
  bikeModel: string;
  colors: BikeColors;
  selectedParts: string[];
  createdAt?: string;
  updatedAt?: string;
  isPublic: boolean;
  likes?: number;
  description?: string;
}

export const DEFAULT_COLORS: BikeColors = {
  body: '#CC0000',
  wheels: '#1a1a1a',
  seat: '#2a2a2a',
  mirrors: '#C0C0C0',
  frame: '#3a3a3a'
};

export const STOCK_COLORS: BikeColors = {
  body: '#CC0000',
  wheels: '#1a1a1a',
  seat: '#2a2a2a',
  mirrors: '#C0C0C0',
  frame: '#3a3a3a'
};