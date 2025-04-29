import { useState, useEffect } from 'react';
import { GridType } from '../types/types';

export function useLevelProgression(
  isAtDoor: boolean, 
  gridType: GridType,
  setGridType: (type: GridType) => void
) {
  const [previousLevel, setPreviousLevel] = useState<GridType | undefined>(undefined);

  useEffect(() => {
    if (isAtDoor) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          setPreviousLevel(gridType);
          setGridType(gridType === 'default' ? 'dungeon' : 'default');
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isAtDoor, gridType, setGridType]);

  return { previousLevel };
}
