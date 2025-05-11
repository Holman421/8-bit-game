import { FC } from 'react';

interface DiceProps {
    value: number | null;
    isRolling?: boolean;
    className?: string;
}

const Dice: FC<DiceProps> = ({ value, isRolling = false, className = '' }) => {
    const getDotClassNames = () => {
        return 'absolute bg-black/90 w-3 h-3 rounded-full';
    };

    // Return appropriate dice face based on the value
    const renderDiceFace = () => {
        if (value === null) {
            return <div className="flex items-center justify-center text-3xl">?</div>;
        }

        switch (value) {
            case 1:
                return (
                    <div className="relative w-full h-full">
                        <div className={`${getDotClassNames()} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
                    </div>
                );
            case 2:
                return (
                    <div className="relative w-full h-full">
                        <div className={`${getDotClassNames()} top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2`}></div>
                    </div>
                );
            case 3:
                return (
                    <div className="relative w-full h-full">
                        <div className={`${getDotClassNames()} top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2`}></div>
                    </div>
                );
            case 4:
                return (
                    <div className="relative w-full h-full">
                        <div className={`${getDotClassNames()} top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2`}></div>
                    </div>
                );
            case 5:
                return (
                    <div className="relative w-full h-full">
                        <div className={`${getDotClassNames()} top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2`}></div>
                    </div>
                );
            case 6:
                return (
                    <div className="relative w-full h-full">
                        <div className={`${getDotClassNames()} top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2`}></div>
                        <div className={`${getDotClassNames()} bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2`}></div>
                    </div>
                );
            default:
                return null;
        }
    }; return (
        <div
            className={`w-14 h-14 bg-white border-2 border-black/80 rounded-lg shadow-md flex items-center justify-center ${isRolling ? 'animate-slow-bounce' : ''} ${className}`}
        >
            {renderDiceFace()}
        </div>
    );
};

export default Dice;
