import { useState, useEffect, useCallback } from 'react';

const MAX_RECENT_COLORS = 8;
const STORAGE_KEY = 'motoph-recent-colors';

/**
 * Hook for managing recently used colors
 */
export function useRecentColors() {
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const colors = JSON.parse(stored);
        setRecentColors(colors);
      }
    } catch (error) {
      console.error('Failed to load recent colors:', error);
    }
  }, []);

  // Add a color to recent colors
  const addRecentColor = useCallback((color: string) => {
    setRecentColors((prev) => {
      // Normalize color to uppercase hex
      const normalized = color.toUpperCase();
      
      // Remove if already exists
      const filtered = prev.filter((c) => c !== normalized);
      
      // Add to front
      const updated = [normalized, ...filtered].slice(0, MAX_RECENT_COLORS);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recent colors:', error);
      }
      
      return updated;
    });
  }, []);

  // Clear recent colors
  const clearRecentColors = useCallback(() => {
    setRecentColors([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recent colors:', error);
    }
  }, []);

  return {
    recentColors,
    addRecentColor,
    clearRecentColors,
  };
}