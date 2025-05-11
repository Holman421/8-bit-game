import { FC, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import MenuImg from '../assets/images/menu.png';
import MemeImg from '../assets/images/hole-meme.jpg';

const GameOver: FC = () => {
    const { isGameOver, resetGame } = useGame();
    const [showMessage, setShowMessage] = useState(false);

    // Add a delay before showing the game over message
    useEffect(() => {
        let timer: any;
        if (isGameOver) {
            timer = setTimeout(() => {
                setShowMessage(true);
            }, 1000); // 1 second delay
        } else {
            setShowMessage(false);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isGameOver]);

    if (!isGameOver || !showMessage) return null;

    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
            <div className="relative px-14 py-20 rounded-lg max-w-sm text-center">
                <img
                    src={MenuImg}
                    className="absolute inset-0 w-full h-full object-fill"
                    alt="Game Over Background"
                />
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4 text-black">Game Over!</h2>
                    <p className="text-xl text-black">Spadl jsi do díry!</p>
                    <img src={MemeImg} alt="Game Over Meme" className="w-full px-5 mt-4 mx-auto mb-4" />
                    <p className="text-xl mb-6 text-black">Imagine bejt tak špatnej...</p>
                    <button
                        onClick={resetGame}
                        className="border duration-250  cursor-pointer text-xl border-black gotisch text-black px-4 py-2 rounded hover:bg-black/80 hover:text-white/80 transition-colors"
                    >
                        Zkusit znovu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOver;
