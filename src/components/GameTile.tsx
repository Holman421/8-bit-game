import { FC } from 'react';
import { TileType } from '../types/types';
// import PathTileImg from "../assets/images/path-game-tile.png";
// import WallTileImg from "../assets/images/wall-game-tile.png";
import GrassTileImg from "../assets/images/grass-game-tile.png";
import DoorTileImg from "../assets/images/door-game-tile.png";
import RockTileImg2 from "../assets/images/rock-game-tile-2.png";
import TreeTileImg from "../assets/images/game-tile-tree.png"
import PathTileImg2 from "../assets/images/game-tile-path.png"
import LavaGameTile from "../assets/images/lava-game-tile.png"
import HoleGameTile from "../assets/images/game-tile-hole.png"


interface GameTileProps {
    type: TileType;
    x: number;
    y: number;
    className?: string;
}

const DEBUG_MODE = false;

const GameTile: FC<GameTileProps> = ({ type, className = '', y, x }) => {
    const tileImages: Record<TileType, string> = {
        grass: GrassTileImg,
        wall: GrassTileImg,
        path: PathTileImg2,
        door: DoorTileImg,
        rock: RockTileImg2,
        lava: LavaGameTile,
        hole: PathTileImg2
    };

    return (
        <div className={`w-full h-full relative ${className}`}>
            <img
                src={tileImages[type]}
                alt={`${type} tile`}
                className="w-full h-full object-cover"

            />
            {DEBUG_MODE && <div className="absolute z-2 inset-0 flex items-center justify-center text-white font-extrabold text-xs">{`${x},${y}`}</div>}

            {type === "hole" &&
                <img
                    src={HoleGameTile}
                    alt={`${type} tile`}
                    className="w-full h-full inset-0 object-cover absolute"
                />
            }
            {type === "wall" &&
                <img
                    src={TreeTileImg}
                    alt={`${type} tile`}
                    className="w-full h-full inset-0 object-cover absolute"
                />
            }
        </div>
    );
};

export default GameTile;
