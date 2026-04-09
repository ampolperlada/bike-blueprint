'use client';

import './glassmorphism.css';
import { useState } from 'react';
import {
  Maximize2,
  RotateCcw,
  Download,
  Save,
  Share2,
  Settings,
  Grid3x3,
} from 'lucide-react';

import { Scene3DViewer } from '@/components/3d/Scene3DViewer';
import { useColorState } from '@/hooks/useColorState';
import { useBuildManager } from '@/hooks/useBuildManager';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { PRESET_COLORS } from '@/lib/constants/colors';
import { MOTORCYCLE_PART_TYPES } from '@/lib/constants/parts';
import { DEFAULT_COLORS } from '@/types/bike';

// New Import
import { ColorPalettes } from '@/components/ColorPalettes';   // ← Add this

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
    loadColors,           // ← Added
  } = useColorState();

  const { buildName, setBuildName, saveBuild, shareBuild } =
    useBuildManager(DEFAULT_COLORS);

  // ───────────────────────────────────────────────
  // Handlers
  // ───────────────────────────────────────────────

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
      prev.includes(partId)
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ───────────────────────────────────────────────
  // Keyboard Shortcuts
  // ───────────────────────────────────────────────
  useKeyboardShortcuts({
    onExport: handleDownload,
    onSave: handleSave,
    onReset: resetColors,
    onRandomize: () => {
      const randomColors: any = { ...colors };
      Object.keys(randomColors).forEach((partId) => {
        const randomPreset = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
        randomColors[partId] = randomPreset.hex;
      });
      // TODO: Use loadColors or setColors from hook when available
    },
    onShare: handleShare,
  });

  const selectedPartLabel =
    MOTORCYCLE_PART_TYPES.find(p => p.id === selectedPart)?.label || 'Part';

  return (
    <div className="cad-layout">
      {/* Top Toolbar */}
      <div className="cad-toolbar">
        <div className="cad-toolbar-left">
          <span style={{ fontSize: '13px', fontWeight: 500 }}>
            Motorcycle Customizer
          </span>
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

      {/* 3D Viewer */}
      <div className="cad-viewer">
        <Scene3DViewer
          colors={colors}
          onToggleFullscreen={handleToggleFullscreen}
        />

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

        <div className="cad-info-overlay">
          <div>Model: NMAX 155 • Scale: 1:1</div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="cad-sidebar">
        {/* Components */}
        <div className="cad-sidebar-section">
          <div className="cad-section-title">Components</div>

          {MOTORCYCLE_PART_TYPES.map(part => (
            <div
              key={part.id}
              className={`cad-component-item ${selectedPart === part.id ? 'selected' : ''}`}
              onClick={() => setSelectedPart(part.id)}
            >
              <div className="cad-component-icon">
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#007ACC', fontFamily: 'monospace' }}>
                  {part.icon}
                </span>
              </div>
              <div className="cad-component-label">
                <div className="cad-component-name">{part.label}</div>
                <div className="cad-component-desc">{part.description}</div>
              </div>
              <div
                className={`cad-component-checkbox ${selectedPartsForPurchase.includes(part.id) ? 'checked' : ''}`}
                onClick={e => {
                  e.stopPropagation();
                  handleTogglePart(part.id);
                }}
              />
            </div>
          ))}
        </div>

        {/* Color Section - Now includes ColorPalettes */}
        <div className="cad-sidebar-section">
          <div className="cad-section-title">
            Color • {selectedPartLabel}
          </div>

          {/* Color Themes / Palettes */}
          <ColorPalettes onApply={loadColors} />   {/* ← Added here */}

          <div className="cad-color-grid" style={{ marginBottom: '16px', marginTop: '16px' }}>
            {PRESET_COLORS.slice(0, 18).map(preset => (
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
              onChange={e => {
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
            onChange={e => setCustomColor(e.target.value)}
            className="cad-text-input"
            placeholder="#FF0000"
            maxLength={7}
          />
        </div>

        {/* Build Name */}
        <div className="cad-sidebar-section">
          <div className="cad-section-title">Build Name</div>
          <input
            type="text"
            value={buildName}
            onChange={e => setBuildName(e.target.value)}
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
          <Save size={16} style={{ marginRight: '6px' }} />
          Save
        </button>

        <button className="cad-button-secondary" onClick={handleShare}>
          <Share2 size={16} style={{ marginRight: '6px' }} />
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