import { BikeColors } from '@/types/bike';
import { PartType } from '@/types/parts';
import { MOTORCYCLE_PART_TYPES } from '@/lib/constants/parts';

interface PartSelectorProps {
  selectedPart: PartType;
  onSelectPart: (part: PartType) => void;
  colors: BikeColors;
}

export function PartSelector({ selectedPart, onSelectPart, colors }: PartSelectorProps) {
  return (
    <div className="bg-gray-900/90 backdrop-blur-md rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-bold mb-4 text-gray-200">Select Component</h3>
      <div className="space-y-2">
        {MOTORCYCLE_PART_TYPES.map((part) => (
          <button
            key={part.id}
            onClick={() => onSelectPart(part.id)}
            className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
              selectedPart === part.id
                ? 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-500'
                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{part.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-white">{part.label}</div>
                <div className="text-sm text-gray-400 mt-1">{part.description}</div>
              </div>
              <div
                className="w-10 h-10 rounded-lg border-2 border-white/20 flex-shrink-0"
                style={{ backgroundColor: colors[part.id] }}
                title={`Current color: ${colors[part.id]}`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}