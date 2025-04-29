import { FC } from 'react';
import CharacterSprite from '../assets/images/character-sprite.png';

interface CharacterTileProps {
    position: { x: number; y: number };
    direction: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
    smoothMovement: boolean;
}

const CharacterTile: FC<CharacterTileProps> = ({ position, direction, isMoving, smoothMovement }) => {
    const spritePositions = {
        down: '0 0',
        right: '0 -100%',
        left: '0 -200%',
        up: '0 -300%'
    };

    return (
        <div
            className="absolute aspect-square"
            style={{
                width: 'calc(100%/7)',
                height: 'calc(100%/7)',
                top: 0,
                left: 0,
                transform: `translate(calc(${position.x} * (100% + 0px)), calc(${position.y} * (100% + 2px)))`,
                transition: smoothMovement ? 'transform 300ms ease-in-out' : 'none',
            }}
        >
            <div
                className="w-3/4 h-3/4 m-auto"
                style={{
                    backgroundImage: `url(${CharacterSprite})`,
                    backgroundPosition: spritePositions[direction],
                    backgroundSize: '400% 400%',
                    animation: isMoving ? 'sprite-animation 0.3s steps(4) infinite' : 'none'
                }}
            />
        </div>
    );
};

export default CharacterTile;
