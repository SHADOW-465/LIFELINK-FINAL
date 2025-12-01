'use client';

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
    trigger: boolean;
    duration?: number;
    onComplete?: () => void;
}

export default function Confetti({ trigger, duration = 5000, onComplete }: ConfettiProps) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Initial size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (trigger) {
            setIsActive(true);
            const timer = setTimeout(() => {
                setIsActive(false);
                if (onComplete) onComplete();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [trigger, duration, onComplete]);

    if (!isActive) return null;

    return (
        <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
        />
    );
}
