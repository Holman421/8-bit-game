export interface InventoryItem {
    id: string;
    name: string;
    image: string;
}

export type TileType = 'grass' | 'wall' | 'path' | 'door' | 'rock' | "lava";

export type GridType = 'default' | 'dungeon';

export interface TilePosition {
    x: number;
    y: number;
}

export interface LevelTile {
    type: TileType;
    position: TilePosition;
}

export interface LevelMap {
    tiles: LevelTile[];
    doors: TilePosition[];
}

export interface LevelConfig {
    [key: string]: LevelMap;
}
