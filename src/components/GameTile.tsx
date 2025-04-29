import { FC } from 'react';
import PathTileImg from "../assets/images/path-game-tile.png";
import WallTileImg from "../assets/images/wall-game-tile.png";
import GrassTileImg from "../assets/images/grass-game-tile.png";
import DoorTileImg from "../assets/images/door-game-tile.png";
import RockTileImg2 from "../assets/images/rock-game-tile-2.png";

type TileType = 'grass' | 'wall' | 'path' | 'door' | 'rock';

interface GameTileProps {
    type: TileType;
    className?: string;
}

const GameTile: FC<GameTileProps> = ({ type, className = '' }) => {
    const tileImages: Record<TileType, string> = {
        grass: GrassTileImg,
        wall: WallTileImg,
        path: PathTileImg,
        door: DoorTileImg,
        rock: RockTileImg2,
    };

    return (
        <div className={`w-full h-full ${className}`}>
            <img
                src={tileImages[type]}
                alt={`${type} tile`}
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M13 13h-2V7h2v6zm0 4h-2v-2h2v2zm-1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/%3E%3C/svg%3E';
                }}
            />
        </div>
    );
};

export default GameTile;
