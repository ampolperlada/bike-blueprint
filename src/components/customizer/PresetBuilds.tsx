import { PRESET_BUILDS } from '@/lib/constants/parts-catalog';
import { Zap, DollarSign, Star, Shield, Sparkles } from 'lucide-react';

interface PresetBuildsProps {
  onSelectPreset: (presetId: keyof typeof PRESET_BUILDS) => void;
  currentPreset?: string | null;
}

const PRESET_ICONS = {
  budget: DollarSign,
  clean_daily: Sparkles,
  racing_look: Zap,
  all_black: Shield,
  premium_build: Star,
};

export function PresetBuilds({ onSelectPreset, currentPreset }: PresetBuildsProps) {
  return (
    <div className="preset-builds">
      <h3 className="section-title">PRESET BUILDS</h3>
      <p className="section-subtitle">Mabilis na setup, proven combinations</p>

      <div className="presets-grid">
        {Object.entries(PRESET_BUILDS).map(([id, preset]) => {
          const Icon = PRESET_ICONS[id as keyof typeof PRESET_ICONS];
          const isActive = currentPreset === id;

          return (
            <button
              key={id}
              onClick={() => onSelectPreset(id as keyof typeof PRESET_BUILDS)}
              className={`preset-card ${isActive ? 'active' : ''}`}
            >
              <div className="preset-icon">
                <Icon size={24} />
              </div>
              
              <div className="preset-content">
                <h4 className="preset-name">{preset.name}</h4>
                <p className="preset-description">{preset.description}</p>
                <div className="preset-price">
                  ₱{preset.total.toLocaleString()}
                </div>
              </div>

              {isActive && (
                <div className="active-badge">
                  Current
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}