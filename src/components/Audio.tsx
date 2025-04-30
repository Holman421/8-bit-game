import { FC, useEffect, useRef, useState } from 'react';
import OverworldAudio from "../assets/audio/overworld-music.mp3"
import DungeonAudio from "../assets/audio/dungeon-music.mp3";

interface AudioProps {
    currentLevel: 'default' | 'dungeon';
    isMenuOpen: boolean;
}

const Audio: FC<AudioProps> = ({ currentLevel, isMenuOpen }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
    }, [isMenuOpen]);

    // Handle level changes
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play().catch(console.error);
        }
    }, [currentLevel]);

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
            </button>
            <audio
                ref={audioRef}
                src={currentLevel === 'default' ? OverworldAudio : DungeonAudio}
                loop
            />
        </>
    );
};

export default Audio;
