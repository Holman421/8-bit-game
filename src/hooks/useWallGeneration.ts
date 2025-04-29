import { useState, useEffect } from 'react';
import { GridType } from '../types/types';

const WALL_LAYOUTS: Record<GridType, string[]> = {
    default: ['1,1', '1,2', '2,1', '4,4', '4,5', '5,4', '2,5', '2,6', '1,5'],
    dungeon: ['1,1', '1,2', '5,1', '5,2', '2,4', '3,4', '4,4', '2,2', '4,2'],
    pokemon: ['1,1', '2,1', '4,1', '5,1', '1,4', '2,4', '4,4', '5,4', '3,2'],
    monopoly: ['1,1', '1,5', '5,1', '5,5', '2,3', '3,2', '3,4', '4,3', '3,3']
};

export function useWallGeneration(gridType: GridType) {
    const [walls, setWalls] = useState<Set<string>>(() => {
        return new Set(WALL_LAYOUTS[gridType]);
    });

    useEffect(() => {
        setWalls(new Set(WALL_LAYOUTS[gridType]));
    }, [gridType]);

    return walls;
}
