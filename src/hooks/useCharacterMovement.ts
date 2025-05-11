import { useState, useEffect, useCallback, useRef } from 'react';

export function useCharacterMovement({
  walls,
  isMenuOpen,
  currentLevel,
  isGameOver,
  resetTrigger
}: {
  walls: Set<string>,
  isMenuOpen: boolean,
  currentLevel: 'default' | 'dungeon',
  isGameOver: boolean,
  resetTrigger: number
}) {
  const [position, setPosition] = useState({ x: 3, y: 6 });
  const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const [smoothMovement, setSmoothMovement] = useState(true);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const previousLevel = useRef<'default' | 'dungeon' | null>(null);
  const safeResetPosition = { x: 3, y: 5 }; // Safe position for reset
  const hasBeenReset = useRef(false); // Track if a reset has happened

  // Function to reset character position to a safe spot
  const resetCharacterPosition = useCallback((newPosition = safeResetPosition) => {
    console.log("Resetting character position to:", newPosition);
    hasBeenReset.current = true;
    setSmoothMovement(false);
    setPosition(newPosition);
    setDirection('down');

    // Re-enable smooth movement after a short delay
    setTimeout(() => {
      setSmoothMovement(true);
    }, 50);
  }, []);

  const move = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    // Prevent movement if game is over, menu is open, or character is bumping/moving
    if (isMoving || isMenuOpen || isBumping || isGameOver) return;

    setDirection(dir);

    setPosition(prev => {
      // Check for boundaries
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

      // Check if the new position hits a wall or boundary
      if (willHitBoundary || walls.has(`${next.x},${next.y}`)) {
        setIsBumping(true);
        setTimeout(() => setIsBumping(false), 150);
        return prev;
      }

      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 300);

      return next;
    });
  }, [isMoving, walls, isMenuOpen, isBumping, isGameOver]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't respond to keys if game is over
    if (isGameOver) return;

    switch (e.key) {
      case 'ArrowUp': move('up'); break;
      case 'ArrowDown': move('down'); break;
      case 'ArrowLeft': move('left'); break;
      case 'ArrowRight': move('right'); break;
    }
  }, [move, isGameOver]);
  // Handle touch input start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Don't respond to touch if game is over
    if (isGameOver) return;

    // Prevent default to avoid pull-to-refresh on mobile
    e.preventDefault();

    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  }, [isGameOver]);

  // Handle touch input end and calculate swipe direction
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Don't respond to touch if game is over
    if (isGameOver) return;

    // Prevent default to avoid pull-to-refresh on mobile
    e.preventDefault();

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    const minSwipeDistance = 30;

    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  }, [touchStart, move, isGameOver]);
  // Handle touch move to prevent scrolling
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Prevent default scrolling behavior when swiping inside the game
    if (!isGameOver && !isMenuOpen) {
      e.preventDefault();
    }
  }, [isGameOver, isMenuOpen]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Handle level changes
  useEffect(() => {
    setSmoothMovement(false);
    hasBeenReset.current = false; // Reset this flag when changing levels

    if (previousLevel.current === 'dungeon' && currentLevel === 'default') {
      setPosition({ x: 6, y: 2 });
    } else if (currentLevel === 'dungeon') {
      setPosition({ x: 3, y: 6 });
    }

    previousLevel.current = currentLevel;
    const timer = setTimeout(() => setSmoothMovement(true), 50);
    return () => clearTimeout(timer);
  }, [currentLevel]);

  // Reset position when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      console.log("Reset triggered, moving character to safe position");

      // Force immediate teleport to a very safe position
      setSmoothMovement(false);

      // Set position to a safe spot far from the hole
      const safePosition = { x: 0, y: 0 }; // Top left corner, far from the hole
      setPosition(safePosition);
      setDirection('down');

      // Wait a moment before allowing movement again
      const moveTimeout = setTimeout(() => {
        setSmoothMovement(true);
      }, 100);

      return () => clearTimeout(moveTimeout);
    }
  }, [resetTrigger]);

  return {
    position,
    direction,
    isMoving,
    smoothMovement,
    isBumping,
    resetCharacterPosition
  };
}
