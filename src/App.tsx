import GameGrid from './components/GameGrid'
import Inventory from './components/Inventory'
import Audio from './components/Audio'
import { useTileGeneration } from './hooks/useTileGeneration'
import { useCharacterMovement } from './hooks/useCharacterMovement'
import { useInventory } from './hooks/useInventory'
import OverworldBg from './assets/images/overworld-bg.png'
import DungeonBg2 from './assets/images/dungeon-bg-2.png'
import { useState } from 'react'
import Menu from './components/Menu'

function App() {
  const [currentLevel, setCurrentLevel] = useState<'default' | 'dungeon'>('default');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { levelData } = useTileGeneration(currentLevel);
  const { position, direction, isMoving, smoothMovement } = useCharacterMovement({
    walls: new Set(levelData.tiles
      .filter(tile => tile.type === 'wall' || tile.type === "lava")
      .map(tile => `${tile.position.x},${tile.position.y}`)),
    isMenuOpen,
    currentLevel
  });

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
          levelData={levelData}
          position={position}
          direction={direction}
          isMoving={isMoving}
          smoothMovement={smoothMovement}
          setCurrentLevel={setCurrentLevel}
        />
        <div className="mt-4">
          <Inventory items={items} />
        </div>
      </div>
    </div>
  )
}

export default App