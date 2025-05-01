import { useState, useEffect, useCallback, useRef } from 'react';

export function useCharacterMovement({ walls, isMenuOpen, currentLevel }: { walls: Set<string>, isMenuOpen: boolean, currentLevel: 'default' | 'dungeon' }) {
  const [position, setPosition] = useState({ x: 3, y: 6 });
  const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const [smoothMovement, setSmoothMovement] = useState(true);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const previousLevel = useRef<'default' | 'dungeon' | null>(null);

  const move = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    if (isMoving || isMenuOpen || isBumping) return;

    setDirection(dir);

    setPosition(prev => {
      // Check boundaries first
      const willHitBoundary = (
        (dir === 'up' && prev.y <= 0) ||
        (dir === 'down' && prev.y >= 6) ||
        (dir === 'left' && prev.x <= 0) ||
        (dir === 'right' && prev.x >= 6)
      );

      let next = { ...prev };
      if (!willHitBoundary) {
        switch (dir) {
          case 'up': next.y -= 1; break;
          case 'down': next.y += 1; break;
          case 'left': next.x -= 1; break;
          case 'right': next.x += 1; break;
        }
      }

      if (willHitBoundary || walls.has(`${next.x},${next.y}`)) {
        setIsBumping(true);
        setTimeout(() => setIsBumping(false), 150);
        return prev;
      }

      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 300);
      return next;
    });
  }, [isMoving, walls, isMenuOpen, isBumping]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': move('up'); break;
      case 'ArrowDown': move('down'); break;
      case 'ArrowLeft': move('left'); break;
      case 'ArrowRight': move('right'); break;
    }
  }, [move]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    // Require minimum swipe distance to trigger movement
    const minSwipeDistance = 30;

    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      move(dx > 0 ? 'right' : 'left');
    } else {
      // Vertical swipe
      move(dy > 0 ? 'down' : 'up');
    }
  }, [touchStart, move]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyDown, handleTouchStart, handleTouchEnd]);

  // Update effect for level change
  useEffect(() => {
    setSmoothMovement(false);

    if (previousLevel.current === 'dungeon' && currentLevel === 'default') {
      setPosition({ x: 6, y: 2 });
    } else if (currentLevel === 'dungeon') {
      setPosition({ x: 3, y: 6 });
    }

    previousLevel.current = currentLevel;
    const timer = setTimeout(() => setSmoothMovement(true), 50);
    return () => clearTimeout(timer);
  }, [currentLevel]);

  return { position, direction, isMoving, smoothMovement, isBumping };
}
