'use client';

import { useState } from 'react';
import { Header } from '@/components/ui/Header';
import { ActionBar } from '@/components/ui/ActionBar';
import { Scene3DViewer } from '@/components/3d/Scene3DViewer';
import { PartSelector } from '@/components/customizer/PartSelector';
import { ColorPicker } from '@/components/customizer/ColorPicker';
import { PricingPanel } from '@/components/panels/PricingPanel';
import { ShoppingCart } from '@/components/panels/ShoppingCart';
import { useColorState } from '@/hooks/useColorState';
import { useBuildManager } from '@/hooks/useBuildManager';
import { PRESET_COLORS } from '@/lib/constants/colors';
import { MOTORCYCLE_PARTS_CATALOG, MOTORCYCLE_PART_TYPES } from '@/lib/constants/parts';
import { DEFAULT_COLORS } from '@/types/bike';

export default function MotoPHCustomizer() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPartsForPurchase, setSelectedPartsForPurchase] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // Color management
  const {
    colors,
    selectedPart,
    setSelectedPart,
    customColor,
    setCustomColor,
    showStock,
    applyColorToSelected,
    resetColors,
    randomizeColors,
    toggleStockView
  } = useColorState();

  // Build management
  const {
    buildName,
    setBuildName,
    savedBuilds,
    saveBuild,
    shareBuild,
    exportBuild
  } = useBuildManager(DEFAULT_COLORS);

  // Handlers
  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `MotoPH-${buildName.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleSave = () => {
    const build = saveBuild(colors, selectedPartsForPurchase);
    alert(`✅ Build saved: ${build.name}`);
  };

  const handleShare = async () => {
    const success = await shareBuild(colors);
    if (success) {
      alert('🔗 Link copied to clipboard! Share your build!');
    } else {
      alert('❌ Failed to copy link. Please try again.');
    }
  };

  const handleRandomize = () => {
    const colorHexes = PRESET_COLORS.map(c => c.hex);
    randomizeColors(colorHexes);
  };

  const handleTogglePart = (partId: string) => {
    setSelectedPartsForPurchase(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const handleOpenCheckout = () => {
    if (selectedPartsForPurchase.length === 0) {
      alert('⚠️ Please select at least one part to customize!');
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckout = (shopId?: string) => {
    console.log('Checkout completed for shop:', shopId);
    setShowCheckout(false);
  };

  const selectedPartObjects = MOTORCYCLE_PARTS_CATALOG.filter(p =>
    selectedPartsForPurchase.includes(p.id)
  );

  const totalPrice = selectedPartObjects.reduce((sum, part) => sum + part.price, 0);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const selectedPartLabel = MOTORCYCLE_PART_TYPES.find(
    p => p.id === selectedPart
  )?.label || 'Part';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Header onSettingsClick={() => setShowSettings(!showSettings)} />

      <div className="container mx-auto p-4 h-[calc(100vh-88px)] flex gap-4">
        {/* 3D Viewer */}
        <Scene3DViewer
          colors={colors}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Action Bar (overlaid on 3D viewer) */}
        <ActionBar
          onDownload={handleDownload}
          onSave={handleSave}
          onShare={handleShare}
          onRandomize={handleRandomize}
          onReset={resetColors}
          onToggleStock={toggleStockView}
          showStock={showStock}
        />

        {/* Sidebar */}
        <div className="w-96 space-y-4 overflow-y-auto">
          <PartSelector
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            colors={colors}
          />

          <ColorPicker
            selectedPartLabel={selectedPartLabel}
            customColor={customColor}
            onCustomColorChange={setCustomColor}
            onApplyPreset={applyColorToSelected}
            onApplyCustom={() => applyColorToSelected(customColor)}
          />

          <PricingPanel
            colors={colors}
            selectedParts={selectedPartsForPurchase}
            onTogglePart={handleTogglePart}
            onOpenCheckout={handleOpenCheckout}
          />
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {showCheckout && (
        <ShoppingCart
          selectedParts={selectedPartObjects}
          totalPrice={totalPrice}
          buildName={buildName}
          onClose={() => setShowCheckout(false)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}