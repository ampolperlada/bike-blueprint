import { useState, useCallback, useMemo } from 'react';
import { 
  calculateTotalPrice, 
  getInstallationTime,
  PARTS_CATALOG,
  getPartOption,
  PRESET_BUILDS,
  type PartOption 
} from '@/lib/constants/parts-catalog';

/**
 * User's part selections
 */
export interface PartSelections {
  body: string;
  wheels: string;
  seat: string;
  mirrors: string;
  frame: string;
  exhaust: string;
}

/**
 * Default selections (all stock = free)
 */
const DEFAULT_SELECTIONS: PartSelections = {
  body: 'stock',
  wheels: 'stock',
  seat: 'stock',
  mirrors: 'stock',
  frame: 'stock',
  exhaust: 'stock',
};

/**
 * Hook for managing part selections and pricing
 */
export function usePriceCalculator() {
  const [selections, setSelections] = useState<PartSelections>(DEFAULT_SELECTIONS);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return calculateTotalPrice(selections);
  }, [selections]);

  // Get installation time estimate
  const installTime = useMemo(() => {
    return getInstallationTime(selections);
  }, [selections]);

  // Get selected parts details
  const selectedParts = useMemo(() => {
    return Object.entries(selections).map(([category, optionId]) => {
      const option = getPartOption(category, optionId);
      const categoryData = PARTS_CATALOG.find(c => c.category === category);
      
      return {
        category,
        categoryName: categoryData?.categoryName || category,
        option: option || { id: 'stock', name: 'Stock', price: 0, description: '', availability: 'in-stock' as const },
      };
    }).filter(item => item.option.id !== 'stock'); // Only show non-stock parts
  }, [selections]);

  // Select a part
  const selectPart = useCallback((category: keyof PartSelections, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [category]: optionId,
    }));
  }, []);

  // Apply preset build
  const applyPreset = useCallback((presetId: keyof typeof PRESET_BUILDS) => {
    const preset = PRESET_BUILDS[presetId];
    setSelections(preset.selections as PartSelections);
  }, []);

  // Reset to stock
  const resetToStock = useCallback(() => {
    setSelections(DEFAULT_SELECTIONS);
  }, []);

  // Get part options for a category
  const getOptionsForCategory = useCallback((category: keyof PartSelections) => {
    const cat = PARTS_CATALOG.find(c => c.category === category);
    return cat?.options || [];
  }, []);

  // Check if current build matches a preset
  const matchingPreset = useMemo(() => {
    const presetEntries = Object.entries(PRESET_BUILDS);
    for (const [id, preset] of presetEntries) {
      const matches = Object.entries(preset.selections).every(
        ([cat, optId]) => selections[cat as keyof PartSelections] === optId
      );
      if (matches) return { id, ...preset };
    }
    return null;
  }, [selections]);

  return {
    selections,
    selectPart,
    totalPrice,
    installTime,
    selectedParts,
    applyPreset,
    resetToStock,
    getOptionsForCategory,
    matchingPreset,
  };
}