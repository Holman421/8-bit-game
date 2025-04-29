import { useState, useEffect } from 'react';
import { GridType } from '../types/types';

export function useWallGeneration(gridType: GridType) {
    const [walls, setWalls] = useState<Set<string>>(() => {
        const wallSet = new Set<string>();
        const reservedPositions = new Set(['3,3', '0,3', '6,3']);

        // Use gridType to seed random generation
        let seed = gridType === 'default' ? 42 : Math.random();
        const random = () => {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        while (wallSet.size < 10) {
            const x = Math.floor(random() * 7);
            const y = Math.floor(random() * 7);
            const pos = `${x},${y}`;
            if (!reservedPositions.has(pos)) {
                wallSet.add(pos);
            }
        }
        return wallSet;
    });

    useEffect(() => {
        // Regenerate walls when grid type changes
        const wallSet = new Set<string>();
        const reservedPositions = new Set(['3,3', '0,3', '6,3']);

        let seed = gridType === 'default' ? 42 : Math.random();
        const random = () => {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        while (wallSet.size < 10) {
            const x = Math.floor(random() * 7);
            const y = Math.floor(random() * 7);
            const pos = `${x},${y}`;
            if (!reservedPositions.has(pos)) {
                wallSet.add(pos);
            }
        }
        setWalls(wallSet);
    }, [gridType]);

    return walls;
}
