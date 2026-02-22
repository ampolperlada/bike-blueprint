import { PRESET_COLORS } from '@/lib/constants/colors';

interface ColorPickerProps {
  selectedPartLabel: string;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  onApplyPreset: (color: string) => void;
  onApplyCustom: () => void;
}

export function ColorPicker({
  selectedPartLabel,
  customColor,
  onCustomColorChange,
  onApplyPreset,
  onApplyCustom
}: ColorPickerProps) {
  return (
    <div className="space-y-4">
      {/* Preset Colors */}
      <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-200">Color Presets</h3>
        <div className="grid grid-cols-3 gap-3">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => onApplyPreset(preset.hex)}
              className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700 hover:border-orange-500 transition-all hover:scale-105"
              style={{ backgroundColor: preset.hex }}
              title={preset.name}
            >
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                <span className="text-xs font-semibold text-white text-center leading-tight">
                  {preset.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color */}
      <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-200">Custom Color</h3>
        <div className="space-y-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            className="w-full h-16 rounded-lg cursor-pointer border-2 border-gray-700"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none font-mono uppercase"
            placeholder="#FF0000"
            maxLength={7}
          />
          <button
            onClick={onApplyCustom}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-semibold transition-all"
          >
            Apply to {selectedPartLabel}
          </button>
        </div>
      </div>
    </div>
  );
}