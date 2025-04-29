import { FC } from 'react';
import { InventoryItem } from '../types/types';

interface InventoryProps {
    items: (InventoryItem | null)[];
}

const Inventory: FC<InventoryProps> = ({ items }) => {
    return (
        <div className="w-full flex gap-2 bg-gray-800 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="flex-1 aspect-square rounded-2xl bg-gray-700 flex items-center justify-center"
                >
                    {items[i] && (
                        <img
                            src={items[i]!.image}
                            alt={items[i]!.name}
                            className="w-10 h-10 object-contain"
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Inventory;
