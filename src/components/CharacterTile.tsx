import { FC, useEffect, useState } from 'react';
import CharacterSprite from '../assets/images/character-sprite.png';
import { useGame } from '../context/GameContext';

const CharacterTile: FC = () => {
    const { position, direction, isMoving, smoothMovement, isBumping, isGameOver, isHoleRevealed } = useGame();
    const [showFallingAnimation, setShowFallingAnimation] = useState(false);

    // Add delay for falling animation to allow character to fully move into the hole position
    useEffect(() => {
        let timer: any;
        if (isGameOver && isHoleRevealed) {
            timer = setTimeout(() => {
                setShowFallingAnimation(true);
            }, 200); // Delay animation to let character fully move into tile
        } else {
            setShowFallingAnimation(false);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isGameOver, isHoleRevealed]);

    const spritePositions = {
        down: '0 0px',
        right: '0 -100%',
        left: '0 -200%',
        up: '0 -298%'
    };

    const getBumpTransform = () => {
        if (!isBumping) return '';
        const bumpDistance = '12px';
        switch (direction) {
            case 'up': return `translateY(-${bumpDistance})`;
            case 'down': return `translateY(${bumpDistance})`;
            case 'left': return `translateX(-${bumpDistance})`;
            case 'right': return `translateX(${bumpDistance})`;
            default: return '';
        }
    };

    // Add falling animation when player falls into a hole
    const getFallingAnimation = () => {
        if (showFallingAnimation) {
            return 'falling-animation 1s forwards';
        }
        return '';
    };

    return (
        <div
            className="absolute aspect-square z-50"
            style={{
                width: 'calc(100%/7)',
                height: 'calc(100%/7)',
                top: 0,
                left: 0,
                transform: `translate(calc(${position.x} * (100% + 0px)), calc(${position.y} * (100% + 1px))) ${getBumpTransform()}`,
                transition: smoothMovement ? 'transform 300ms ease-out' : 'none',
                animation: getFallingAnimation()
            }}
        >
            <div
                className="w-3/4 h-3/4 m-auto"
                style={{
                    backgroundImage: `url(${CharacterSprite})`,
                    backgroundPosition: spritePositions[direction],
                    backgroundSize: '405% 405%',
                    animation: (isMoving || isBumping) ? 'sprite-animation 0.2s steps(4) infinite' : 'none'
                }}
            />
        </div>
    );
};

export default CharacterTile;
