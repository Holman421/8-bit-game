import { FC, useEffect, useRef } from 'react';
import GameTile from './GameTile';
import CharacterTile from './CharacterTile';
import { TileType } from '../types/types';
import DungeonMusic from "../assets/audio/dungeon-music.mp3"
import OverworldMusic from "../assets/audio/overworld-music.mp3"

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

const GameGrid: FC<GameGridProps> = ({ type, walls, position, direction, isMoving, smoothMovement }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.src = type === 'default' ? OverworldMusic : DungeonMusic;
            audio.loop = true;
            audio.volume = 0.5;
            audio.play().catch(() => { });
        }
    }, [type]);

    return (
        <>
            <audio ref={audioRef} preload="auto" />
            <div className="relative grid grid-cols-7 w-full gap-0.5 bg-gray-800 p-0.5 aspect-square">
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
