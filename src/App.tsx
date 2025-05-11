import GameGrid from './components/GameGrid'
import Audio from './components/Audio'
import OverworldBg from './assets/images/overworld-bg.png'
import DungeonBg2 from './assets/images/dungeon-bg-2.png'
import Menu from './components/Menu'
import GameOver from './components/GameOver'
import BossFight from './components/BossFight'
import { GameProvider, useGame } from './context/GameContext'

// The main application that uses the game context
const GameApp = () => {
  const { currentLevel, isMenuOpen } = useGame();
  const backgroundImage = currentLevel === 'default' ? OverworldBg : DungeonBg2;

  return (
    <div className="flex justify-center flex-col items-center min-h-screen bg-gray-100 relative overflow-hidden">
      <img
        src={backgroundImage}
        className="absolute inset-0 w-full h-full object-cover"
        alt="background"
      />
      <Menu />
      <Audio />
      <GameOver />
      <BossFight />
      <div className={`relative max-w-[400px] p-4 transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <GameGrid />
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  )
}

export default App