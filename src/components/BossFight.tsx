import { FC, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import MenuImg from '../assets/images/menu.png';
import GoblinGif from '../assets/images/goblin.gif';
import Dice from './Dice';

const BossFight: FC = () => {
    const { isBossFightActive, resetGame, setIsVictory } = useGame();
    const [showMessage, setShowMessage] = useState(false);
    const [gameStage, setGameStage] = useState<'intro' | 'rolling' | 'result' | 'conclusion'>('intro');
    const [playerRoll, setPlayerRoll] = useState<number | null>(null);
    const [bossRoll, setBossRoll] = useState<number | null>(null);
    const [result, setResult] = useState<'win' | 'lose' | null>(null);
    const [rolling, setRolling] = useState(false);
    // Track if this is the first roll
    const [isFirstRoll, setIsFirstRoll] = useState(true);    // Array of defeat messages
    const defeatMessages = [
        "si tě namazal na chleba...",
        "s tebou vytřel podlahu...",
        "s tebou nakrmil krysy...",
        "na tebe vytáhl tvoje trauma z dětství...",
        "ti připomněl co se stalo tehdy na táboře...",
        "ti ukázal, kdo je tady boss..."
    ];

    // Track used defeat messages to prevent repetition
    const [usedMessages, setUsedMessages] = useState<string[]>([]);

    // Current defeat message
    const [currentDefeatMessage, setCurrentDefeatMessage] = useState(() => {
        // Pick random defeat message on component mount
        const randomIndex = Math.floor(Math.random() * defeatMessages.length);
        const initialMessage = defeatMessages[randomIndex];
        setUsedMessages([initialMessage]);
        return initialMessage;
    });    // Reset the boss fight state when it becomes inactive
    useEffect(() => {
        if (!isBossFightActive) {
            setGameStage('intro');
            setPlayerRoll(null);
            setBossRoll(null);
            setResult(null);
            setRolling(false);
            setIsFirstRoll(true); // Reset the first roll state
            setUsedMessages([]); // Reset the used messages tracking
        }
    }, [isBossFightActive]);

    // Add a delay before showing the boss fight message
    useEffect(() => {
        let timer: any;
        if (isBossFightActive) {
            timer = setTimeout(() => {
                setShowMessage(true);
            }, 500); // 0.5 second delay
        } else {
            setShowMessage(false);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isBossFightActive]);

    // Function to roll dice for boss and player
    const rollDice = () => {
        setRolling(true);
        setPlayerRoll(null);
        setBossRoll(null);
        setResult(null);
        setGameStage('rolling');

        // Roll for the boss first with animation effect - slower animation (150ms instead of 100ms)
        const rollAnimation = setInterval(() => {
            setBossRoll(Math.floor(Math.random() * 6) + 1);
        }, 150);

        // Stop boss roll and set the final value - longer animation time (2000ms instead of 1500ms)
        setTimeout(() => {
            clearInterval(rollAnimation);

            // For the first roll, ensure boss gets a high number (5 or 6)
            let finalBossRoll;
            if (isFirstRoll) {
                finalBossRoll = Math.floor(Math.random() * 2) + 5; // 5 or 6
            } else {
                finalBossRoll = Math.floor(Math.random() * 6) + 1; // 1-6
            }

            setBossRoll(finalBossRoll);

            // Longer pause between boss roll and player roll (1000ms delay)
            setTimeout(() => {
                // Now roll for the player with slower animation
                const playerRollAnimation = setInterval(() => {
                    setPlayerRoll(Math.floor(Math.random() * 6) + 1);
                }, 150);

                // Stop player roll and determine the result - longer animation (2000ms)
                setTimeout(() => {
                    clearInterval(playerRollAnimation);

                    // For the first roll, ensure player rolls a low number (1-4)
                    let finalPlayerRoll;
                    if (isFirstRoll) {
                        finalPlayerRoll = Math.min(finalBossRoll - 1, Math.floor(Math.random() * 4) + 1); // 1-4, but always less than boss
                        setIsFirstRoll(false); // No longer the first roll
                    } else {
                        finalPlayerRoll = Math.floor(Math.random() * 6) + 1; // 1-6
                    }

                    setPlayerRoll(finalPlayerRoll);                    // Delay showing the result
                    setTimeout(() => {
                        if (finalPlayerRoll > finalBossRoll) {
                            setResult('win');
                            // Set victory state to trigger victory audio in the Audio component
                            setIsVictory(true);
                        } else {
                            setResult('lose');
                            // Pick a new random defeat message that hasn't been used yet if possible
                            let availableMessages = defeatMessages.filter(message => !usedMessages.includes(message));

                            // If all messages have been used, reset tracking and make all available again
                            if (availableMessages.length === 0) {
                                availableMessages = defeatMessages.filter(message => message !== currentDefeatMessage);
                                setUsedMessages([currentDefeatMessage]); // Keep only the current message as used
                            }

                            // Pick a random message from available ones
                            const randomIndex = Math.floor(Math.random() * availableMessages.length);
                            const newMessage = availableMessages[randomIndex];

                            // Update used messages and current message
                            setUsedMessages(prev => [...prev, newMessage]);
                            setCurrentDefeatMessage(newMessage);
                        }

                        setRolling(false);
                        setGameStage('result');
                    }, 400); // Pause before showing result
                }, 2000);
            }, 750); // Delay between boss and player roll
        }, 2000);
    };    // Function to handle fight button click
    const handleFight = () => {
        if (gameStage === 'intro') {
            setGameStage('rolling');
            rollDice();
        } else if (gameStage === 'result' && result === 'lose') {
            // If player lost, try again
            rollDice();
        } else if (gameStage === 'result' && result === 'win') {
            // If player won, show the conclusion
            setGameStage('conclusion');
        }
    };    // Function to handle PDF download
    const handleDownloadPDF = () => {
        // Create a dummy PDF download link
        const link = document.createElement('a');
        link.href = '/invitation.pdf'; // Path to the PDF file
        link.download = 'invitation.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const { setCurrentLevel } = useGame();

    // Function to handle complete game reset
    const handleCompleteReset = () => {
        resetGame();
        // Get the setCurrentLevel function from the context
        // Set the level to default
        setCurrentLevel('default');
    };

    if (!isBossFightActive || !showMessage) return null;

    return (
        <div className="absolute z-[100] inset-0 bg-black/70 flex flex-col items-center justify-center ">
            <div className="relative px-14 py-20 rounded-lg max-w-sm text-center min-w-[400px]">
                <img
                    src={MenuImg}
                    className="absolute inset-0 w-full h-full object-fill"
                    alt="Boss Fight Background"
                />
                <div className="relative z-10 flex flex-col items-center">
                    {gameStage !== 'conclusion' &&
                        <h2 className="text-5xl mt-6 gotisch font-bold mb-4 text-black">Boss Fight!</h2>
                    }
                    {gameStage !== 'conclusion' && (
                        <div className="flex justify-center mb-4">
                            <img
                                src={GoblinGif}
                                alt="Goblin"
                                className="w-24 h-24 object-contain"
                            />
                        </div>
                    )}
                    {gameStage === 'intro' && (
                        <>
                            <p className="text-2xl text-black">Goblin tě zpozoroval!</p>
                            <p className="text-xl px-4 mt-2 mb-8 text-black">K jeho poražení musíš hodit kostkou větší číslo než on</p>
                        </>
                    )}

                    {gameStage === 'rolling' && (
                        <>
                            <div className="flex justify-around w-full mb-6">
                                <div className="text-center">
                                    <p className="text-2xl mb-2 text-black">Goblin:</p>
                                    <Dice value={bossRoll} isRolling={bossRoll === null || rolling} className="mx-auto" />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl mb-2 text-black">Ty:</p>
                                    <Dice value={playerRoll} isRolling={playerRoll === null || rolling} className="mx-auto" />
                                </div>
                            </div>
                            <p className="text-xl italic text-black mb-4">
                                {bossRoll === null ? "Goblin hází kostkou..." :
                                    playerRoll === null ? "Hází goblin..." :
                                        "Házíš kostkou ty..."}
                            </p>
                        </>
                    )}

                    {gameStage === 'result' && (
                        <>
                            <div className="flex justify-around w-full mb-4">
                                <div className="text-center">
                                    <p className="text-2xl mb-2 text-black">Goblin:</p>
                                    <Dice value={bossRoll} className="mx-auto" />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl mb-2 text-black">Ty:</p>
                                    <Dice value={playerRoll} className="mx-auto" />
                                </div>
                            </div>

                            {result === 'win' && (
                                <div className="flex flex-col items-center">
                                    <p className="text-3xl text-green-950 font-bold">Vyhrál jsi!</p>
                                    <p className="text-3xl mb-6 text-green-950 font-bold">Goblin je rip.</p>
                                </div>
                            )}                            {result === 'lose' && (
                                <>
                                    <p className="text-3xl mb-2 text-red-950 font-bold">Prohrál jsi!</p>
                                    <p className="text-xl mb-6 text-red-950">Goblin {currentDefeatMessage}</p>
                                </>
                            )}
                        </>)}

                    {gameStage === 'conclusion' && (
                        <div className="flex flex-col items-center px-4">
                            <p className="text-xl mt-4">u goblina jsi našel</p>
                            <h2 className="text-5xl gotisch font-bold text-black">Pozvánku!</h2>
                            <p className="text-xl mb-4">na nejlepší oslavu narozenin ever!</p>
                            <div className="text-black text-left mb-6">
                                <p className="mb-2 text-xl">Kde: []</p>
                                <p className="mb-2 text-xl">Kdy: []</p>
                                <p className='text-xl'>Proč: Straším tu už čtvrt-století</p>
                            </div>

                            <p className="mb-6 text-2xl">Budu se na tebe těšit !!!</p>

                            <button
                                onClick={handleDownloadPDF}
                                className="border w-full max-w-xs duration-250 mb-3 cursor-pointer text-xl border-black gotisch text-black px-5 py-2 rounded hover:bg-black/80 hover:text-white/80 transition-colors"
                            >
                                Stáhnout pozvánku
                            </button>
                            <button
                                onClick={handleCompleteReset}
                                className="border mb-20 w-full max-w-xs duration-250 cursor-pointer text-xl border-black gotisch text-black px-5 py-2 rounded hover:bg-black/80 hover:text-white/80 transition-colors"
                            >
                                Vrátit se na začátek
                            </button>
                        </div>
                    )}

                    {gameStage !== 'conclusion' && (
                        <button
                            onClick={handleFight}
                            disabled={rolling}
                            className={`border duration-250 mb-6 cursor-pointer text-2xl border-black gotisch text-black px-5 py-3 rounded hover:bg-black/80 hover:text-white/80 transition-colors ${rolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {gameStage === 'intro' ? 'Bojovat' :
                                gameStage === 'rolling' ? 'Házení...' :
                                    result === 'win' ? 'Pokračovat' : 'Zkusit znovu'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BossFight;
