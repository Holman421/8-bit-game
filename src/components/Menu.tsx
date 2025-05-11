import { FC, useState, useEffect } from 'react';
import MenuImg from '../assets/images/menu.png';
import { useGame } from '../context/GameContext';

const Menu: FC = () => {
    const { isMenuOpen, setIsMenuOpen } = useGame();
    const [showTutorial, setShowTutorial] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect if user is on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const startGame = () => {
        if (showTutorial) {
            setIsMenuOpen(false);
        } else {
            setShowTutorial(true);
        }
    };

    return (
        <div className={`absolute flex justify-center items-center z-10 w-full md:w-[500px] transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={MenuImg} className="absolute w-full object-cover" alt="Menu Background" />
            <div className='flex flex-col z-2 px-18 md:px-24 items-center w-full'>
                {!showTutorial ? (
                    <>
                        <h1 className="text-4xl md:text-5xl text-center mb-4 text-black font-bold">Vítej bludimíre</h1>
                        <p className='text-black text-[18px] text-center'>Jsem ráda ze jsi zavítal sem, na nejlepší interaktivní pozvánku ever na moji ještě lepší oslavu narozenin.</p>
                        <p className='text-black text-[18px] mt-3 text-center'>Chtěl by jsi vědět kdy a kde?</p>
                        <p className='text-black text-[18px] mb-3 text-center'>Smolík pacholík!</p>
                        <p className='text-black text-[18px] text-center'>Vše se dozvíš až projdeš touhle challedží</p>
                        <button
                            className="border cursor-pointer transition-colors duration-250 hover:bg-black/80 hover:text-white/80 mt-6 border-black text-black px-4 py-2 rounded"
                            onClick={startGame}
                        >
                            Začít
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl md:text-4xl text-center mb-4 text-black font-bold">Jak hrát</h2>
                        {isMobile ? (
                            <>
                                <p className='text-black text-[18px] text-center mb-3'>Používáš mobilní zařízení.</p>
                                <p className='text-black text-[18px] text-center'>Pohybuj postavou <strong>přejížděním prstem</strong> nahoru, dolů, doleva a doprava.</p>
                            </>
                        ) : (
                            <>
                                <p className='text-black text-[18px] text-center mb-3'>Používáš počítač.</p>
                                <p className='text-black text-[18px] text-center'>Pohybuj postavou pomocí <strong>šipek na klávesnici</strong>.</p>
                            </>
                        )}
                        <p className='text-black text-[18px] mt-3 text-center'>Prozkoumej svět, najdi dveře do jeskyně a tam poraž zrádného Goblina.</p>
                        <button
                            className="border cursor-pointer transition-colors duration-250 hover:bg-black/80 hover:text-white/80 mt-6 border-black text-black px-4 py-2 rounded"
                            onClick={startGame}
                        >
                            Pokračovat
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Menu;