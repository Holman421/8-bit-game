import { FC, useEffect } from 'react';
import GameTile from './GameTile';
import CharacterTile from './CharacterTile';
import { TileType, LevelMap } from '../types/types';

type GridType = 'default' | 'dungeon';

interface GameGridProps {
    type: GridType;
    levelData: LevelMap;
    position: { x: number; y: number };
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    smoothMovement: boolean;
    setCurrentLevel: React.Dispatch<React.SetStateAction<"default" | "dungeon">>;
}

const getTileType = (x: number, y: number, levelData: LevelMap, gridType: GridType): TileType => {
    const pos = `${x},${y}`;

    // Check doors first
    if (levelData.doors.some(door => `${door.x},${door.y}` === pos)) {
        return 'door';
    }

    // Then check other tiles
    const tile = levelData.tiles.find(t => `${t.position.x},${t.position.y}` === pos);
    if (tile) {
        return tile.type;
    }

    // Default ground tiles
    return gridType === 'dungeon' ? 'rock' : 'grass';
};

const isAtDoorPosition = (x: number, y: number, levelData: LevelMap): boolean => {
    return levelData.doors.some(door => door.x === x && door.y === y);
};

const GameGrid: FC<GameGridProps> = ({ type, levelData, position, direction, isMoving, smoothMovement, setCurrentLevel }) => {
    const isAtDoor = isAtDoorPosition(position.x, position.y, levelData);

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

    return (
        <>
            <div
                className="relative grid grid-cols-7 w-full gap-0.5 bg-gray-800 p-0.5 aspect-square"
                onClick={handleTap}
            >
                {Array.from({ length: 49 }).map((_, i) => {
                    const x = i % 7;
                    const y = Math.floor(i / 7);
                    return (
                        <GameTile
                            key={i}
                            x={x}
                            y={y}
                            type={getTileType(x, y, levelData, type)}
                        />
                    );
                })}
                <CharacterTile
                    position={position}
                    direction={direction}
                    isMoving={isMoving}
                    smoothMovement={smoothMovement}
                />
            </div>
        </>
    );
};

export default GameGrid;
