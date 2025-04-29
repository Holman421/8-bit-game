import { useState, useEffect, useCallback } from 'react';

export function useCharacterMovement({ walls }: { walls: Set<string> }) {
  const [position, setPosition] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [smoothMovement] = useState(true);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isMoving) return;

    setPosition(prev => {
      let next = { ...prev };
      switch (e.key) {
        case 'ArrowUp':
          setDirection('up');
          next = prev.y > 0 ? { ...prev, y: prev.y - 1 } : prev;
          break;
        case 'ArrowDown':
          setDirection('down');
          next = prev.y < 6 ? { ...prev, y: prev.y + 1 } : prev;
          break;
        case 'ArrowLeft':
          setDirection('left');
          next = prev.x > 0 ? { ...prev, x: prev.x - 1 } : prev;
          break;
        case 'ArrowRight':
          setDirection('right');
          next = prev.x < 6 ? { ...prev, x: prev.x + 1 } : prev;
          break;
      }

      if (next !== prev && !walls.has(`${next.x},${next.y}`)) {
        setIsMoving(true);
        setTimeout(() => setIsMoving(false), 300);
        return next;
      }
      return prev;
    });
  }, [isMoving, walls]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { position, direction, isMoving, smoothMovement };
}
