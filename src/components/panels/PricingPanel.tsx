import { useState } from 'react';
import { Part } from '@/types/parts';
import { BikeColors } from '@/types/bike';
import { MOTORCYCLE_PARTS_CATALOG } from '@/lib/constants/parts';
import { calculateTotalPerformance, formatPerformanceValue, calculateTotalPrice } from '@/lib/utils/performance';

interface PricingPanelProps {
  colors: BikeColors;
  selectedParts: string[];
  onTogglePart: (partId: string) => void;
  onOpenCheckout: () => void;
}

export function PricingPanel({ colors, selectedParts, onTogglePart, onOpenCheckout }: PricingPanelProps) {
  const [showPricing, setShowPricing] = useState(true);

  const selectedPartObjects = MOTORCYCLE_PARTS_CATALOG.filter(p => 
    selectedParts.includes(p.id)
  );
  
  const totalPrice = calculateTotalPrice(selectedPartObjects);
  const performance = calculateTotalPerformance(selectedPartObjects);

  const isPartCustomized = (partId: string): boolean => {
    const defaultColors: Record<string, string> = {
      body: '#CC0000',
      wheels: '#1a1a1a',
      seat: '#2a2a2a',
      mirrors: '#C0C0C0',
      frame: '#3a3a3a'
    };
    return colors[partId as keyof BikeColors] !== defaultColors[partId];
  };

  return (
    <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-md rounded-xl p-6 border border-orange-800/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-orange-400">💰 Build Your NMAX</h3>
        <button
          onClick={() => setShowPricing(!showPricing)}
          className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
        >
          {showPricing ? 'Hide' : 'Show'} Parts
        </button>
      </div>

      {showPricing && (
        <div className="space-y-3">
          {MOTORCYCLE_PARTS_CATALOG.map((part) => {
            const isSelected = selectedParts.includes(part.id);
            const isCustom = isPartCustomized(part.id);

            return (
              <div
                key={part.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600/20 border-orange-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => onTogglePart(part.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{part.name}</span>
                      {isCustom && (
                        <span className="text-xs bg-orange-600 px-2 py-0.5 rounded-full">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-orange-400 font-semibold mb-1">
                      {part.brand} • {part.model}
                    </div>
                    <div className="text-sm text-gray-400">{part.description}</div>

                    {/* Compatibility */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {part.compatibility.models.map((model, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-700"
                        >
                          ✔ {model}
                        </span>
                      ))}
                    </div>

                    {/* Warning */}
                    {part.compatibility.warning && (
                      <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
                        {part.compatibility.warning}
                      </div>
                    )}

                    {/* Performance */}
                    {(part.performance.acceleration !== 0 ||
                      part.performance.handling !== 0 ||
                      part.performance.sound !== 0 ||
                      part.performance.weight !== 0) && (
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                        {part.performance.acceleration !== 0 && (
                          <div className="flex items-center gap-1">
                            <span>⚡</span>
                            <span className={part.performance.acceleration > 0 ? 'text-green-400' : 'text-red-400'}>
                              {formatPerformanceValue('acceleration', part.performance.acceleration).text}
                            </span>
                          </div>
                        )}
                        {part.performance.handling !== 0 && (
                          <div className="flex items-center gap-1">
                            <span>🛞</span>
                            <span className={part.performance.handling > 0 ? 'text-green-400' : 'text-red-400'}>
                              {formatPerformanceValue('handling', part.performance.handling).text}
                            </span>
                          </div>
                        )}
                        {part.performance.weight !== 0 && (
                          <div className="flex items-center gap-1">
                            <span>⚖</span>
                            <span className={part.performance.weight < 0 ? 'text-green-400' : 'text-orange-400'}>
                              {formatPerformanceValue('weight', part.performance.weight).text}
                            </span>
                          </div>
                        )}
                        {part.performance.sound !== 0 && (
                          <div className="flex items-center gap-1">
                            <span>🔊</span>
                            <span className="text-blue-400">
                              {formatPerformanceValue('sound', part.performance.sound).text}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Maintenance */}
                    {part.maintenance && isSelected && (
                      <div className="mt-2 text-xs text-gray-500 italic">
                        💡 {part.maintenance}
                      </div>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onTogglePart(part.id)}
                    className="w-5 h-5 rounded border-gray-600 text-orange-600 focus:ring-orange-500 mt-1 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center text-sm mt-2 pt-2 border-t border-gray-700">
                  <span className="text-orange-400 font-bold">
                    ₱{part.priceRange.min.toLocaleString()} - ₱{part.priceRange.max.toLocaleString()}
                  </span>
                  <span className="text-gray-500">{part.installTime}</span>
                </div>
              </div>
            );
          })}

          {/* Build Summary */}
          {selectedParts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-orange-700">
              {/* Performance Summary */}
              <div className="mb-3 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs font-semibold text-gray-400 mb-2">PERFORMANCE IMPACT</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {performance.acceleration !== 0 && (
                    <div className="flex items-center gap-2">
                      <span>⚡ Acceleration:</span>
                      <span className={performance.acceleration > 0 ? 'text-green-400 font-bold' : 'text-red-400'}>
                        {formatPerformanceValue('acceleration', performance.acceleration).text}
                      </span>
                    </div>
                  )}
                  {performance.handling !== 0 && (
                    <div className="flex items-center gap-2">
                      <span>🛞 Handling:</span>
                      <span className={performance.handling > 0 ? 'text-green-400 font-bold' : 'text-red-400'}>
                        {formatPerformanceValue('handling', performance.handling).text}
                      </span>
                    </div>
                  )}
                  {performance.weight !== 0 && (
                    <div className="flex items-center gap-2">
                      <span>⚖ Weight:</span>
                      <span className={performance.weight < 0 ? 'text-green-400 font-bold' : 'text-orange-400'}>
                        {formatPerformanceValue('weight', performance.weight).text}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-white">BUILD TOTAL:</span>
                <span className="text-2xl font-bold text-orange-400">
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
              <button 
                onClick={onOpenCheckout}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 font-bold transition-all text-white shadow-lg"
              >
                🛒 Checkout & Buy
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">
                Free consultation • Install by certified mechanics
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}