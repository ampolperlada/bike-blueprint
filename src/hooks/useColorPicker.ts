import { useState } from 'react';
import { DEFAULT_COLORS } from '@/lib/constants/colors';
import type { PartId } from '@/lib/constants/parts';

export interface ColorState {
  body: string;
  wheels: string;
  seat: string;
  mirrors: string;
  frame: string;
}

export function useColorPicker() {
  const [selectedPart, setSelectedPart] = useState<PartId>('body');
  const [colors, setColors] = useState<ColorState>(DEFAULT_COLORS);

  const applyColor = (color: string) => {
    setColors(prev => ({
      ...prev,
      [selectedPart]: color
    }));
  };

  const resetColors = () => {
    setColors(DEFAULT_COLORS);
  };

  const updatePartColor = (part: PartId, color: string) => {
    setColors(prev => ({
      ...prev,
      [part]: color
    }));
  };

  return {
    selectedPart,
    setSelectedPart,
    colors,
    applyColor,
    resetColors,
    updatePartColor
  };
}