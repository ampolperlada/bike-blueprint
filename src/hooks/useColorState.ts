import { useState, useCallback } from 'react';
import { BikeColors, DEFAULT_COLORS, STOCK_COLORS } from '@/types/bike';
import { PartType } from '@/types/parts';

export function useColorState() {
  const [colors, setColors] = useState<BikeColors>(DEFAULT_COLORS);
  const [selectedPart, setSelectedPart] = useState<PartType>('body');
  const [customColor, setCustomColor] = useState('#FF0000');
  const [showStock, setShowStock] = useState(false);
  const [stockSnapshot, setStockSnapshot] = useState<BikeColors | null>(null);

  const applyColor = useCallback((partType: PartType, color: string) => {
    setColors(prev => ({
      ...prev,
      [partType]: color
    }));
  }, []);

  const applyColorToSelected = useCallback((color: string) => {
    applyColor(selectedPart, color);
  }, [selectedPart, applyColor]);

  const resetColors = useCallback(() => {
    setColors(DEFAULT_COLORS);
  }, []);

  const randomizeColors = useCallback((presetColors: string[]) => {
    const getRandomColor = () => presetColors[Math.floor(Math.random() * presetColors.length)];
    setColors({
      body: getRandomColor(),
      wheels: getRandomColor(),
      seat: getRandomColor(),
      mirrors: getRandomColor(),
      frame: getRandomColor()
    });
  }, []);

  const toggleStockView = useCallback(() => {
    if (showStock) {
      // Switch back to custom
      if (stockSnapshot) {
        setColors(stockSnapshot);
        setStockSnapshot(null);
      }
    } else {
      // Switch to stock
      setStockSnapshot({ ...colors });
      setColors(STOCK_COLORS);
    }
    setShowStock(!showStock);
  }, [showStock, colors, stockSnapshot]);

  const loadColors = useCallback((newColors: BikeColors) => {
    setColors(newColors);
  }, []);

  const isPartCustomized = useCallback((partType: PartType): boolean => {
    return colors[partType] !== DEFAULT_COLORS[partType];
  }, [colors]);

  const getCustomizedParts = useCallback((): PartType[] => {
    return (Object.keys(colors) as PartType[]).filter(isPartCustomized);
  }, [colors, isPartCustomized]);

  return {
    colors,
    selectedPart,
    setSelectedPart,
    customColor,
    setCustomColor,
    showStock,
    applyColor,
    applyColorToSelected,
    resetColors,
    randomizeColors,
    toggleStockView,
    loadColors,
    isPartCustomized,
    getCustomizedParts
  };
}