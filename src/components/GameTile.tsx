import { FC } from 'react';
import { TileType } from '../types/types';
import GrassTileImg from "../assets/images/grass-game-tile.png";
import DoorTileImg from "../assets/images/door-game-tile.png";
import RockTileImg2 from "../assets/images/rock-game-tile-2.png";
import TreeTileImg from "../assets/images/game-tile-tree.png";
import PathTileImg2 from "../assets/images/game-tile-path.png";
import LavaGameTile from "../assets/images/lava-game-tile.png";
import HoleGameTile from "../assets/images/game-tile-hole.png";
import GoblinTile from "../assets/images/goblin.gif";

interface GameTileProps {
    type: TileType;
    x: number;
    y: number;
    className?: string;
    isHoleRevealed?: boolean;
}

const DEBUG_MODE = false;

const GameTile: FC<GameTileProps> = ({ type, className = '', y, x, isHoleRevealed = false }) => {
    const tileImages: Record<TileType, string> = {
        grass: GrassTileImg,
        wall: GrassTileImg,
        path: PathTileImg2,
        door: DoorTileImg,
        rock: RockTileImg2,
        lava: LavaGameTile,
        hole: PathTileImg2,
        goblin: RockTileImg2
    };

    return (
        <div className={`w-full h-full relative ${className}`}>            {/* Base tile image */}
            <img
                src={tileImages[type]}
                alt={`${type} tile`}
                className="w-full h-full object-cover"
            />

            {DEBUG_MODE && (
                <div className="absolute z-2 inset-0 flex items-center justify-center text-white font-extrabold text-xs">
                    {`${x},${y}`}
                    {type === 'hole' ? ' (H)' : ''}
                    {type === 'goblin' ? ' (G)' : ''}
                </div>
            )}

            {/* Ensure the hole overlay has a high z-index */}
            {type === "hole" && isHoleRevealed && (
                <img
                    src={HoleGameTile}
                    alt="hole"
                    className="size-[120%] -translate-y-[0px] inset-0 object-cover absolute z-10"
                />
            )}

            {type === "wall" && (
                <img
                    src={TreeTileImg}
                    alt={`wall tile`}
                    className="w-full h-full inset-0 object-cover absolute"
                />
            )}

            {/* Display goblin overlay */}
            {type === "goblin" && (
                <img
                    src={GoblinTile}
                    alt="goblin"
                    className="w-full h-full inset-0 object-cover absolute z-5"
                />
            )}
        </div>
    );
};

export default GameTile;
