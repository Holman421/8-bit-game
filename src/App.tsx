import GameGrid from './components/GameGrid'
import Inventory from './components/Inventory'
import Audio from './components/Audio'
import { useWallGeneration } from './hooks/useWallGeneration'
import { useCharacterMovement } from './hooks/useCharacterMovement'
import { useInventory } from './hooks/useInventory'
import OverworldBg from './assets/images/overworld-bg.png'
import DungeonBg2 from './assets/images/dungeon-bg-2.png'
import { useState, useEffect } from 'react'
import Menu from './components/Menu'

function App() {
  const [currentLevel, setCurrentLevel] = useState<'default' | 'dungeon'>('default');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const walls = useWallGeneration(currentLevel);
  const { position, direction, isMoving, smoothMovement } = useCharacterMovement({
    walls, isMenuOpen
  },);

  const isAtDoor = (currentLevel === 'default' && position.x === 6 && position.y === 3) ||
    (currentLevel === 'dungeon' && position.x === 3 && position.y === 6);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isAtDoor) {
        setCurrentLevel(prev => prev === 'default' ? 'dungeon' : 'default');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAtDoor]);

  const handleTap = () => {
    if (isAtDoor) {
      setCurrentLevel(prev => prev === 'default' ? 'dungeon' : 'default');
    }
  };

  const { items } = useInventory();
  const backgroundImage = currentLevel === 'default' ? OverworldBg : DungeonBg2;

  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100 relative overflow-hidden">
      <img
        src={backgroundImage}
        className="absolute inset-0 w-full h-full object-cover"
        alt="background"
      />
      <Menu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <Audio currentLevel={currentLevel} isMenuOpen={isMenuOpen} />
      <div className={`relative max-w-[400px] p-4 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <GameGrid
          type={currentLevel}
          walls={walls}
          position={position}
          direction={direction}
          isMoving={isMoving}
          smoothMovement={smoothMovement}
          onTap={handleTap}
        />
        <div className="mt-4">
          <Inventory items={items} />
        </div>
      </div>
    </div>
  )
}

export default App