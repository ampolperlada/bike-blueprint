import { BikeColors } from '@/types/bike';
import { COLOR_PALETTES } from '@/lib/constants/color-palettes';

interface ColorPalettesProps {
  onApply: (colors: BikeColors) => void;
}

export function ColorPalettes({ onApply }: ColorPalettesProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wide text-gray-400 font-mono">
        Color Themes
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {COLOR_PALETTES.map(palette => (
          <button
            key={palette.id}
            onClick={() => onApply(palette.colors)}
            className="p-2 bg-[#252526] hover:bg-[#2A2A2A] border border-[#3E3E42] rounded text-left transition-colors"
            title={palette.description}
          >
            {/* Color preview */}
            <div className="flex gap-1 mb-2">
              {Object.values(palette.colors).slice(0, 4).map((color, i) => (
                <div 
                  key={i}
                  className="w-5 h-5 rounded-sm border border-[#3E3E42]"
                  style={{ background: color }}
                />
              ))}
            </div>
            {/* Name */}
            <div className="text-xs text-gray-200 font-medium mb-0.5">
              {palette.name}
            </div>
            {/* Description */}
            <div className="text-[10px] text-gray-500 line-clamp-1">
              {palette.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}