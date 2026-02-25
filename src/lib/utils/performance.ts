import { Part, PerformanceImpact } from '@/types/parts';

export function calculateTotalPerformance(selectedParts: Part[]): PerformanceImpact {
  return selectedParts.reduce(
    (total, part) => ({
      acceleration: total.acceleration + part.performance.acceleration,
      handling: total.handling + part.performance.handling,
      sound: total.sound + part.performance.sound,
      weight: total.weight + part.performance.weight
    }),
    { acceleration: 0, handling: 0, sound: 0, weight: 0 }
  );
}

export function formatPerformanceValue(
  metric: 'acceleration' | 'handling' | 'sound' | 'weight',
  value: number
): { text: string; color: string; icon: string } {
  switch (metric) {
    case 'acceleration':
      return {
        text: value > 0 ? `+${value}` : value === 0 ? 'Neutral' : `${value}`,
        color: value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400',
        icon: '⚡'
      };
    case 'handling':
      return {
        text: value > 0 ? `+${value}` : value === 0 ? 'Neutral' : `${value}`,
        color: value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400',
        icon: '🛞'
      };
    case 'sound':
      const soundLevels = ['Quiet', 'Moderate', 'Loud', 'Very Loud'];
      return {
        text: soundLevels[Math.min(value, 3)] || 'Quiet',
        color: value > 1 ? 'text-orange-400' : 'text-blue-400',
        icon: '🔊'
      };
    case 'weight':
      return {
        text: `${value > 0 ? '+' : ''}${value.toFixed(1)}kg`,
        color: value < 0 ? 'text-green-400' : value > 0 ? 'text-orange-400' : 'text-gray-400',
        icon: '⚖'
      };
  }
}

export function calculateTotalPrice(selectedParts: Part[]): number {
  return selectedParts.reduce((sum, part) => sum + part.price, 0);
}

export function getPriceRange(selectedParts: Part[]): { min: number; max: number } {
  return selectedParts.reduce(
    (range, part) => ({
      min: range.min + part.priceRange.min,
      max: range.max + part.priceRange.max
    }),
    { min: 0, max: 0 }
  );
}

export function getPerformanceGrade(impact: PerformanceImpact): {
  grade: string;
  color: string;
  description: string;
} {
  const totalScore = impact.acceleration + impact.handling - (impact.weight > 0 ? 1 : 0);
  
  if (totalScore >= 4) {
    return { grade: 'S', color: 'text-yellow-400', description: 'Racing Performance' };
  } else if (totalScore >= 2) {
    return { grade: 'A', color: 'text-green-400', description: 'High Performance' };
  } else if (totalScore >= 0) {
    return { grade: 'B', color: 'text-blue-400', description: 'Balanced' };
  } else {
    return { grade: 'C', color: 'text-gray-400', description: 'Stock Performance' };
  }
}