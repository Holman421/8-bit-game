export interface InventoryItem {
    id: string;
    name: string;
    image: string;
}

export type TileType = 'grass' | 'wall' | 'path' | 'door' | 'rock';

export type GridType = 'default' | 'dungeon' | 'pokemon' | 'monopoly';
