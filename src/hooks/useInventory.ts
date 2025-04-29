import { useState } from 'react';
import { InventoryItem } from '../types/types';

export function useInventory(maxSize: number = 5) {
    const [items, setItems] = useState<(InventoryItem | null)[]>(Array(maxSize).fill(null));

    const addItem = (item: InventoryItem) => {
        const emptySlot = items.findIndex(slot => slot === null);
        if (emptySlot !== -1) {
            const newItems = [...items];
            newItems[emptySlot] = item;
            setItems(newItems);
            return true;
        }
        return false;
    };

    const removeItem = (index: number) => {
        if (index >= 0 && index < items.length) {
            const newItems = [...items];
            newItems[index] = null;
            setItems(newItems);
        }
    };

    return { items, addItem, removeItem };
}
