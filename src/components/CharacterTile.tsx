import { FC } from 'react';
import CharacterSprite from '../assets/images/character-sprite.png';

interface CharacterTileProps {
    position: { x: number; y: number };
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    smoothMovement: boolean;
    isBumping?: boolean;
}

const CharacterTile: FC<CharacterTileProps> = ({ position, direction, isMoving, smoothMovement, isBumping }) => {
    const spritePositions = {
        down: '0 0px',
        right: '0 -100%',
        left: '0 -200%',
        up: '0 -298%'
    };

    const getBumpTransform = () => {
        if (!isBumping) return '';
        const bumpDistance = '12px'; // Increased from previous value
        switch (direction) {
            case 'up': return `translateY(-${bumpDistance})`;
            case 'down': return `translateY(${bumpDistance})`;
            case 'left': return `translateX(-${bumpDistance})`;
            case 'right': return `translateX(${bumpDistance})`;
            default: return '';
        }
    };

    return (
        <div
            className="absolute aspect-square"
            style={{
                width: 'calc(100%/7)',
                height: 'calc(100%/7)',
                top: 0,
                left: 0,
                transform: `translate(calc(${position.x} * (100% + 0px)), calc(${position.y} * (100% + 1px))) ${getBumpTransform()}`,
                transition: smoothMovement ? 'transform 300ms ease-out' : 'none', // Faster transition
            }}
        >
            <div
                className="w-3/4 h-3/4 m-auto"
                style={{
                    backgroundImage: `url(${CharacterSprite})`,
                    backgroundPosition: spritePositions[direction],
                    backgroundSize: '405% 405%',
                    animation: (isMoving || isBumping) ? 'sprite-animation 0.2s steps(4) infinite' : 'none' // Slightly faster animation
                }}
            />
        </div>
    );
};

export default CharacterTile;
