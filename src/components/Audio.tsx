import { FC, useEffect, useRef, useState } from 'react';
import OverworldAudio from "../assets/audio/overworld-music.mp3";
import DungeonAudio from "../assets/audio/dungeon-music.mp3";
import { useGame } from '../context/GameContext';
import GameOverAudio from "../assets/audio/game-over.mp3";
import BossFightAudio from "../assets/audio/boss-fight.mp3";
import WinAudio from "../assets/audio/win.mp3";

const Audio: FC = () => {
    const { currentLevel, isMenuOpen, isGameOver, isBossFightActive, isVictory } = useGame();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState<string>(OverworldAudio);
    const previousGameOverState = useRef(isGameOver);
    const previousVictoryState = useRef(isVictory);    // Determine which audio should play based on game state
    useEffect(() => {
        let audioSource = currentLevel === 'default' ? OverworldAudio : DungeonAudio;

        // Override with boss fight audio when boss fight is active
        if (isBossFightActive) {
            audioSource = BossFightAudio;
        }

        // Override with game over audio when game is over
        if (isGameOver) {
            audioSource = GameOverAudio;
        }

        // Override with victory audio when player has won
        if (isVictory) {
            audioSource = WinAudio;
        }

        // Only change and reload if the audio source changed
        if (audioSource !== currentAudio) {
            setCurrentAudio(audioSource);

            if (audioRef.current && isPlaying) {
                audioRef.current.pause();
                // We'll load the new audio in the next effect
            }
        }

        // Track when game over state changes from true to false (reset)
        if (previousGameOverState.current && !isGameOver) {
            // Game has been reset, go back to normal music
            const resetAudio = currentLevel === 'default' ? OverworldAudio : DungeonAudio;
            setCurrentAudio(resetAudio);
        }
        previousGameOverState.current = isGameOver;
        previousVictoryState.current = isVictory;

    }, [currentLevel, isGameOver, isBossFightActive, isVictory, currentAudio, isPlaying]);

    // Handle initial volume and menu state
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            if (!isMenuOpen && !isPlaying) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(console.error);
            }
        }
    }, [isMenuOpen, isPlaying]);    // Handle audio source changes
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play().catch(console.error);
        }
    }, [currentAudio, isPlaying]);

    // Handle transition back from victory state
    useEffect(() => {
        // When victory state changes from true to false (reset)
        if (previousVictoryState.current && !isVictory) {
            // Game has been reset, go back to normal music
            const resetAudio = currentLevel === 'default' ? OverworldAudio : DungeonAudio;
            setCurrentAudio(resetAudio);
        }
    }, [isVictory, currentLevel]);

    // Special handling for game over sound and win sound - don't loop them
    useEffect(() => {
        if (audioRef.current) {
            if (currentAudio === GameOverAudio || currentAudio === WinAudio) {
                audioRef.current.loop = false;
            } else {
                audioRef.current.loop = true;
            }
        }
    }, [currentAudio]);

    const toggleSound = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(console.error);
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            <button
                onClick={toggleSound}
                className="fixed top-4 right-4 z-20 bg-white/80 p-2 rounded-full shadow-md"
            >
                {isPlaying ? '🔊' : '🔈'}
            </button>            <audio
                ref={audioRef}
                src={currentAudio}
                loop={currentAudio !== GameOverAudio && currentAudio !== WinAudio}
            />
        </>
    );
};

export default Audio;
