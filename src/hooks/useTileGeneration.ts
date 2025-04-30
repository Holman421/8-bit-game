import { useState, useEffect } from 'react';
import { GridType, LevelConfig } from '../types/types';

const LEVEL_LAYOUTS: LevelConfig = {
    default: {
        tiles: [
            { type: 'wall', position: { x: 1, y: 1 } },
            { type: 'wall', position: { x: 3, y: 1 } },
            { type: 'wall', position: { x: 3, y: 2 } },
            { type: 'wall', position: { x: 1, y: 2 } },
            { type: 'wall', position: { x: 2, y: 1 } },
            { type: 'wall', position: { x: 4, y: 4 } },
            { type: 'wall', position: { x: 4, y: 5 } },
            { type: 'wall', position: { x: 5, y: 4 } },
            { type: 'path', position: { x: 2, y: 5 } },
            { type: 'wall', position: { x: 2, y: 6 } },
            { type: 'wall', position: { x: 1, y: 5 } },
            { type: 'wall', position: { x: 4, y: 3 } },
            { type: 'path', position: { x: 4, y: 2 } },
            { type: 'path', position: { x: 5, y: 2 } },
            { type: 'wall', position: { x: 5, y: 1 } },
            { type: 'wall', position: { x: 5, y: 3 } },
            { type: 'path', position: { x: 4, y: 1 } },
            { type: 'path', position: { x: 3, y: 6 } },
            { type: 'path', position: { x: 4, y: 6 } },
            { type: 'path', position: { x: 5, y: 5 } },
            { type: 'path', position: { x: 6, y: 5 } },
            { type: 'path', position: { x: 5, y: 6 } },
            { type: 'path', position: { x: 6, y: 4 } },
            { type: 'path', position: { x: 6, y: 3 } },
            { type: 'path', position: { x: 3, y: 5 } },
            { type: 'path', position: { x: 2, y: 4 } },
            { type: 'path', position: { x: 1, y: 4 } },
            { type: 'path', position: { x: 1, y: 3 } },
            { type: 'path', position: { x: 0, y: 3 } },
            { type: 'path', position: { x: 0, y: 2 } },
            { type: 'path', position: { x: 0, y: 1 } },
            { type: 'path', position: { x: 0, y: 0 } },
            { type: 'path', position: { x: 1, y: 0 } },
            { type: 'path', position: { x: 2, y: 0 } },
            { type: 'path', position: { x: 3, y: 0 } },
            { type: 'path', position: { x: 4, y: 0 } },

        ],
        doors: [{ x: 6, y: 2 }]
    },
    dungeon: {
        tiles: [
            { type: 'lava', position: { x: 1, y: 1 } },
            { type: 'lava', position: { x: 1, y: 2 } },
            { type: 'lava', position: { x: 5, y: 1 } },
            { type: 'lava', position: { x: 5, y: 2 } },
            { type: 'lava', position: { x: 2, y: 4 } },
            { type: 'lava', position: { x: 3, y: 4 } },
            { type: 'lava', position: { x: 4, y: 4 } },
            { type: 'lava', position: { x: 2, y: 2 } },
            { type: 'lava', position: { x: 4, y: 2 } },
        ],
        doors: [{ x: 3, y: 6 }]
    }
};

export function useTileGeneration(gridType: GridType) {
    const [levelData, setLevelData] = useState(() => LEVEL_LAYOUTS[gridType]);

    useEffect(() => {
        setLevelData(LEVEL_LAYOUTS[gridType]);
    }, [gridType]);

    const wallSet = new Set(
        levelData.tiles
            .filter(tile => tile.type === 'wall')
            .map(tile => `${tile.position.x},${tile.position.y}`)
    );

    const doorSet = new Set(
        levelData.doors.map(door => `${door.x},${door.y}`)
    );

    const pathSet = new Set(
        levelData.tiles
            .filter(tile => tile.type === 'path')
            .map(tile => `${tile.position.x},${tile.position.y}`)
    );

    return {
        walls: wallSet,
        doors: doorSet,
        paths: pathSet,
        levelData
    };
}
