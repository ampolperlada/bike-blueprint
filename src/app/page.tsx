'use client';

import { useState } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  Download, 
  Save, 
  Share2,
  Settings,
  Grid3x3
} from 'lucide-react';
import { Scene3DViewer } from '@/components/3d/Scene3DViewer';
import { useColorState } from '@/hooks/useColorState';
import { useBuildManager } from '@/hooks/useBuildManager';
import { PRESET_COLORS } from '@/lib/constants/colors';
import { MOTORCYCLE_PARTS_CATALOG, MOTORCYCLE_PART_TYPES } from '@/lib/constants/parts';
import { DEFAULT_COLORS } from '@/types/bike';

export default function CADCustomizer() {
  const [selectedPartsForPurchase, setSelectedPartsForPurchase] = useState<string[]>([]);

  const {
    colors,
    selectedPart,
    setSelectedPart,
    customColor,
    setCustomColor,
    applyColorToSelected,
    resetColors,
  } = useColorState();

  const { buildName, setBuildName, saveBuild, shareBuild } = useBuildManager(DEFAULT_COLORS);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${buildName.replace(/\s+/g, '-')}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleSave = () => {
    saveBuild(colors, selectedPartsForPurchase);
  };

  const handleShare = async () => {
    await shareBuild(colors);
  };

  const handleTogglePart = (partId: string) => {
    setSelectedPartsForPurchase(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const selectedPartLabel = MOTORCYCLE_PART_TYPES.find(p => p.id === selectedPart)?.label || 'Part';

  return (
    <div className="cad-layout">
      {/* Top Toolbar */}
      <div className="cad-toolbar">
        <div className="cad-toolbar-left">
          <span style={{ fontSize: '13px', fontWeight: 500 }}>Motorcycle Customizer</span>
          <span style={{ fontSize: '11px', color: '#808080', marginLeft: '12px' }}>
            NMAX 155
          </span>
        </div>
        
        <div className="cad-toolbar-right">
          <button className="cad-tool-button" onClick={handleToggleFullscreen}>
            <Maximize2 size={16} />
          </button>
          <button className="cad-tool-button" onClick={resetColors}>
            <RotateCcw size={16} />
          </button>
          <button className="cad-tool-button">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* 3D Viewer - Full Screen */}
      <div className="cad-viewer">
        <Scene3DViewer
          colors={colors}
          onToggleFullscreen={handleToggleFullscreen}
        />
        
        {/* View Controls */}
        <div className="cad-view-controls">
          <button className="cad-view-button" title="Fullscreen">
            <Maximize2 size={18} />
          </button>
          <button className="cad-view-button active" title="Auto Rotate">
            <RotateCcw size={18} />
          </button>
          <button className="cad-view-button" title="Grid">
            <Grid3x3 size={18} />
          </button>
        </div>
        
        {/* Info Overlay */}
        <div className="cad-info-overlay">
          <div>Model: NMAX 155 • Scale: 1:1</div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="cad-sidebar">
        {/* Components Section */}
        <div className="cad-sidebar-section">
          <div className="cad-section-title">Components</div>
          {MOTORCYCLE_PART_TYPES.map((part) => (
            <div
              key={part.id}
              className={`cad-component-item ${selectedPart === part.id ? 'selected' : ''}`}
              onClick={() => setSelectedPart(part.id)}
            >
              <div className="cad-component-icon">
                <span style={{ fontSize: '18px' }}>{part.icon}</span>
              </div>
              <div className="cad-component-label">
                <div className="cad-component-name">{part.label}</div>
                <div className="cad-component-desc">{part.description}</div>
              </div>
              <div 
                className={`cad-component-checkbox ${selectedPartsForPurchase.includes(part.id) ? 'checked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePart(part.id);
                }}
              />
            </div>
          ))}
        </div>

        {/* Color Section */}
        <div className="cad-sidebar-section">
          <div className="cad-section-title">
            Color • {selectedPartLabel}
          </div>
          
          {/* Color Grid */}
          <div className="cad-color-grid" style={{ marginBottom: '16px' }}>
            {PRESET_COLORS.slice(0, 18).map((preset) => (
              <button
                key={preset.hex}
                className={`cad-color-swatch ${colors[selectedPart] === preset.hex ? 'selected' : ''}`}
                style={{ backgroundColor: preset.hex }}
                onClick={() => applyColorToSelected(preset.hex)}
                title={preset.name}
              />
            ))}
          </div>

          {/* Custom Color */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#808080', marginBottom: '8px' }}>
              Custom Color
            </div>
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                applyColorToSelected(e.target.value);
              }}
              className="cad-color-input"
            />
          </div>

          {/* Hex Input */}
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="cad-text-input"
            placeholder="#FF0000"
            maxLength={7}
          />
        </div>

        {/* Build Info */}
        <div className="cad-sidebar-section">
          <div className="cad-section-title">Build Name</div>
          <input
            type="text"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            className="cad-text-input"
            placeholder="My Custom Build"
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="cad-action-bar">
        <button className="cad-button-primary" onClick={handleDownload}>
          <Download size={16} style={{ marginRight: '6px' }} />
          Export
        </button>
        <button className="cad-button-secondary" onClick={handleSave}>
          <Save size={16} style={{ marginRight: '6px', display: 'inline-block' }} />
          Save
        </button>
        <button className="cad-button-secondary" onClick={handleShare}>
          <Share2 size={16} style={{ marginRight: '6px', display: 'inline-block' }} />
          Share
        </button>
        
        <div style={{ flex: 1 }} />
        
        <span style={{ fontSize: '11px', color: '#808080' }}>
          {selectedPartsForPurchase.length} parts selected
        </span>
      </div>
    </div>
  );
}