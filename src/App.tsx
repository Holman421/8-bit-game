import GameGrid from './components/GameGrid'
import Inventory from './components/Inventory'
import { useWallGeneration } from './hooks/useWallGeneration'
import { useCharacterMovement } from './hooks/useCharacterMovement'
import { useInventory } from './hooks/useInventory'
import OverworldBg from './assets/images/overworld-bg.jpg'
import DungeonBg2 from './assets/images/dungeon-bg-2.png'
import { useState, useEffect } from 'react'

function App() {
  const [currentLevel, setCurrentLevel] = useState<'default' | 'dungeon'>('default');
  const walls = useWallGeneration(currentLevel);
  const { position, direction, isMoving, smoothMovement } = useCharacterMovement({
    walls
  });

  // Simple door check
  const isAtDoor = (currentLevel === 'default' && position.x === 6 && position.y === 3) ||
    (currentLevel === 'dungeon' && position.x === 3 && position.y === 6);

  // Single keypress handler for everything
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isAtDoor) {
        setCurrentLevel(prev => prev === 'default' ? 'dungeon' : 'default');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAtDoor]);

  const { items } = useInventory();
  const backgroundImage = currentLevel === 'default' ? OverworldBg : DungeonBg2;

  return (
    <div
      className="flex justify-center flex-col items-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative max-w-[400px] p-4">
        <GameGrid
          type={currentLevel}
          walls={walls}
          position={position}
          direction={direction}
          isMoving={isMoving}
          smoothMovement={smoothMovement}
          onSpawn={pos => setCurrentLevel(pos)}
        />
        <div className="mt-4">
          <Inventory items={items} />
        </div>
      </div>
    </div>
  )
}

export default App