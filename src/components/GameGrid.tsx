import { FC } from 'react';
import GameTile from './GameTile';
import CharacterTile from './CharacterTile';
import { TileType } from '../types/types';

type GridType = 'default' | 'dungeon' | 'pokemon' | 'monopoly';

const DOOR_POSITIONS = {
    default: { x: 6, y: 3 },
    dungeon: { x: 3, y: 6 },
    pokemon: { x: 6, y: 3 },
    monopoly: { x: 6, y: 3 }
};

interface GameGridProps {
    type: GridType;
    walls: Set<string>;
    position: { x: number; y: number };
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    smoothMovement: boolean;
    onTap?: () => void;
}

const getTileType = (x: number, y: number, walls: Set<string>, gridType: GridType): TileType => {
    // Check for door first
    const doorPos = DOOR_POSITIONS[gridType];
    if (doorPos && x === doorPos.x && y === doorPos.y) return 'door';

    // Then check walls
    if (walls.has(`${x},${y}`)) return 'wall';

    // Finally return appropriate ground tile
    switch (gridType) {
        case 'dungeon':
            return 'rock';
        case 'pokemon':
            return 'grass';
        case 'monopoly':
            return 'path';
        default:
            return 'grass';
    }
};

const GameGrid: FC<GameGridProps> = ({ type, walls, position, direction, isMoving, smoothMovement, onTap }) => {
    return (
        <>
            <div
                className="relative grid grid-cols-7 w-full gap-0.5 bg-gray-800 p-0.5 aspect-square"
                onClick={onTap}
            >
                {Array.from({ length: 49 }).map((_, i) => {
                    const x = i % 7;
                    const y = Math.floor(i / 7);
                    return (
                        <GameTile
                            key={i}
                            type={getTileType(x, y, walls, type)}
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
