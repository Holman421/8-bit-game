import { FC, useEffect, useCallback } from 'react';
import GameTile from './GameTile';
import CharacterTile from './CharacterTile';
import { useGame } from '../context/GameContext';
import { TileType } from '../types/types';

const GameGrid: FC = () => {
    const {
        currentLevel,
        levelData,
        isHoleRevealed,
    } = useGame();    // Selectively prevent default touch behavior only for vertical swipes
    const preventVerticalSwipe = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        
        // Store the initial touch position in a data attribute
        if (e.type === 'touchstart') {
            const targetElem = e.currentTarget as HTMLElement;
            targetElem.dataset.touchStartY = touch.clientY.toString();
            targetElem.dataset.touchStartX = touch.clientX.toString();
            return;
        }
        
        // For touchmove, check if it's a significant vertical swipe (pull-to-refresh gesture)
        if (e.type === 'touchmove') {
            const targetElem = e.currentTarget as HTMLElement;
            const startY = parseInt(targetElem.dataset.touchStartY || '0');
            const startX = parseInt(targetElem.dataset.touchStartX || '0');
            const deltaY = touch.clientY - startY;
            const deltaX = touch.clientX - startX;
            
            // Only prevent default for significant downward vertical swipes
            // This allows button clicks and horizontal swipes to work
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 5) {
                e.preventDefault();
            }
        }
    }, []);// Check for duplicate tile positions at component mount
    useEffect(() => {
        const positionMap = new Map();
        levelData.tiles.forEach(tile => {
            const posKey = `${tile.position.x},${tile.position.y}`;
            if (positionMap.has(posKey)) {
                console.error(`Duplicate tile position found at ${posKey}:`,
                    `Types: ${positionMap.get(posKey)} and ${tile.type}`);
            } else {
                positionMap.set(posKey, tile.type);
            }
        });
    }, [levelData]);

    // No longer need space key or tap to change levels - it happens automatically
    const handleTap = () => {
        // Door transfer now happens automatically in GameContext
    };

    const getTileType = (x: number, y: number): TileType => {
        const pos = `${x},${y}`;

        // Check doors first
        if (levelData.doors.some(door => `${door.x},${door.y}` === pos)) {
            return 'door';
        }

        // Then check other tiles - using exact position matching
        const matchingTiles = levelData.tiles.filter(t =>
            t.position.x === x && t.position.y === y
        );

        // Log error if multiple tiles found at the same position
        if (matchingTiles.length > 1) {
            console.error(`Multiple tiles (${matchingTiles.length}) found at position ${x},${y}:`,
                matchingTiles.map(t => t.type));
        }

        const tile = matchingTiles[0];

        // Log if this is a hole
        if (tile?.type === 'hole') {
            console.log(`Found hole tile at ${x},${y}`);
        }

        if (tile) {
            return tile.type;
        }

        // Default ground tiles
        return currentLevel === 'dungeon' ? 'rock' : 'grass';
    }; return (
        <>            <div
                className="relative grid grid-cols-7 w-full gap-0.5 bg-gray-800 p-0.5 aspect-square"
                onClick={handleTap}
                onTouchStart={preventVerticalSwipe}
                onTouchMove={preventVerticalSwipe}
                onTouchEnd={preventVerticalSwipe}
            >
                {Array.from({ length: 49 }).map((_, i) => {
                    const x = i % 7;
                    const y = Math.floor(i / 7);
                    const tileType = getTileType(x, y);

                    // Simplified hole check
                    const shouldShowHole = tileType === 'hole' && isHoleRevealed;
                    return (
                        <GameTile
                            key={i}
                            x={x}
                            y={y}
                            type={tileType}
                            isHoleRevealed={shouldShowHole}
                        />
                    );
                })}
                <CharacterTile />
            </div>
        </>
    );
};

export default GameGrid;
