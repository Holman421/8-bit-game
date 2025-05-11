import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useTileGeneration } from '../hooks/useTileGeneration';
import { useCharacterMovement } from '../hooks/useCharacterMovement';
import { GridType, LevelMap } from '../types/types';

// Define the shape of our context
interface GameContextType {
    // Game state
    currentLevel: GridType;
    setCurrentLevel: React.Dispatch<React.SetStateAction<GridType>>;
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isGameOver: boolean;
    isHoleRevealed: boolean;
    isBossFightActive: boolean;
    isVictory: boolean;
    setIsVictory: React.Dispatch<React.SetStateAction<boolean>>;
    resetGame: () => void;

    // Character state
    position: { x: number; y: number };
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    isBumping: boolean;
    smoothMovement: boolean;

    // Level data
    levelData: LevelMap;
    walls: Set<string>;
    doors: Set<string>;
    paths: Set<string>;
    holes: Set<string>;
    goblins: Set<string>;
    lava: Set<string>;

    // Actions
    revealHole: () => void;
    isAtDoor: boolean;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Create the provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {    // Game state
    const [currentLevel, setCurrentLevel] = useState<GridType>("default");
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [isHoleRevealed, setIsHoleRevealed] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isBossFightActive, setIsBossFightActive] = useState(false);
    const [isVictory, setIsVictory] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    const isRevealingHole = useRef(false);
    const hasReset = useRef(false);

    // Get level data
    const {
        levelData,
        walls,
        doors,
        paths,
        holes,
        goblins,
        lava
    } = useTileGeneration(currentLevel);

    // Function to reveal the hole with added delay
    const revealHole = () => {
        if (!isHoleRevealed && !isRevealingHole.current && !isGameOver) {
            isRevealingHole.current = true;

            // Delay hole reveal to let character fully move into position
            setTimeout(() => {
                setIsHoleRevealed(true);

                // Delay game over state to give time for falling animation
                setTimeout(() => {
                    setIsGameOver(true);
                    isRevealingHole.current = false;
                }, 200);
            }, 200);
        }
    };    // Function to reset the game
    const resetGame = () => {
        // First reset the game state
        setIsGameOver(false);
        setIsHoleRevealed(false);
        setIsBossFightActive(false);
        setIsVictory(false);
        isRevealingHole.current = false;

        // Set a special flag to prevent hole detection for a period after reset
        const preventHoleDetectionTimeout = 1000; // 1 second safety
        hasReset.current = true;

        // Reset the position first
        setResetTrigger(prev => prev + 1);

        // After a delay, allow hole detection again
        setTimeout(() => {
            hasReset.current = false;
        }, preventHoleDetectionTimeout);
    };    // Get character movement with the reset ability
    const {
        position,
        direction,
        isMoving,
        isBumping,
        smoothMovement,
        resetCharacterPosition
    } = useCharacterMovement({
        walls: new Set([
            ...Array.from(walls),
            ...Array.from(lava), // Treat lava as walls
            // When game is over or boss fight is active, treat the hole as a wall to prevent movement
            ...(isGameOver || isBossFightActive ? Array.from(holes) : [])
        ]),
        isMenuOpen,
        currentLevel,
        isGameOver: isGameOver || isBossFightActive, // Disable movement during boss fight too
        resetTrigger
    });

    // Listen for reset trigger changes to reset character position
    useEffect(() => {
        if (resetTrigger > 0) {
            // Use a safe position that's away from any holes
            resetCharacterPosition({ x: 3, y: 5 });
        }
    }, [resetTrigger, resetCharacterPosition]);

    // Check if player is currently on a hole and reveal it
    useEffect(() => {
        // Don't detect holes if we just reset the game
        if (hasReset.current) {
            return; // Exit early, no hole detection during reset protection period
        }

        const currentPos = `${position.x},${position.y}`;
        const isPlayerOnHole = holes.has(currentPos);

        if (currentLevel === 'default' &&
            !isGameOver &&
            !isRevealingHole.current &&
            isPlayerOnHole &&
            !isHoleRevealed) {

            revealHole();
        }
    }, [position, currentLevel, holes, isHoleRevealed, isGameOver]);

    // Check if player is near a goblin and trigger boss fight
    useEffect(() => {
        if (hasReset.current || isGameOver || isBossFightActive) {
            return; // Don't check if we're resetting or already in a game over/boss fight state
        }

        // Convert goblin positions from string format "x,y" to array of coord objects
        const goblinPositions = Array.from(goblins).map(pos => {
            const [x, y] = pos.split(',').map(Number);
            return { x, y };
        });

        // Check if player is within 1 block of any goblin
        const isNearGoblin = goblinPositions.some(goblin => {
            const distance = Math.abs(goblin.x - position.x) + Math.abs(goblin.y - position.y);
            return distance <= 1; // Manhattan distance of 1 or less means adjacent or diagonal
        });

        if (isNearGoblin && currentLevel === 'dungeon') {
            setIsBossFightActive(true);
        }
    }, [position, currentLevel, goblins, isGameOver, isBossFightActive]);    // Reset hole revealed state when changing levels
    useEffect(() => {
        setIsHoleRevealed(false);
        setIsBossFightActive(false);
        isRevealingHole.current = false;
    }, [currentLevel]);

    // Check if player is at a door and automatically transfer them to the dungeon
    const isAtDoor = levelData.doors.some(
        door => door.x === position.x && door.y === position.y
    );
    useEffect(() => {
        // Only check in the default world and only transfer to dungeon
        if (currentLevel === 'default' && isAtDoor && !isGameOver && !isBossFightActive) {
            // Add a slight delay before transition for better user experience
            const transferTimer = setTimeout(() => {
                setCurrentLevel('dungeon');
            }, 300);

            return () => clearTimeout(transferTimer);
        }
    }, [isAtDoor, currentLevel, isGameOver, isBossFightActive, setCurrentLevel]);    // Check if player is at a door

    // Check if player is at a door and automatically transfer them to the dungeon
    useEffect(() => {
        // Only check in the default world and only transfer to dungeon
        if (currentLevel === 'default' && isAtDoor && !isGameOver && !isBossFightActive) {
            // Add a slight delay before transition for better user experience
            const transferTimer = setTimeout(() => {
                setCurrentLevel('dungeon');
            }, 300);

            return () => clearTimeout(transferTimer);
        }
    }, [isAtDoor, currentLevel, isGameOver, isBossFightActive, setCurrentLevel]);    // The context value that will be passed to consumers
    const contextValue: GameContextType = {
        currentLevel,
        setCurrentLevel,
        isMenuOpen,
        setIsMenuOpen,
        isGameOver,
        isHoleRevealed,
        isBossFightActive,
        isVictory,
        setIsVictory,
        resetGame,
        position,
        direction,
        isMoving,
        isBumping,
        smoothMovement,
        levelData,
        walls,
        doors,
        paths,
        holes,
        goblins,
        lava,
        revealHole,
        isAtDoor
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};

// Custom hook for consuming the context
export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
