'use client';

import { useMemo } from 'react';

const COLORS = [
    ['#FF0055', '#FF5588'], // Pink
    ['#00E0FF', '#0099FF'], // Blue
    ['#B026FF', '#7A00FF'], // Purple
    ['#00FF99', '#00CC66'], // Green
    ['#FFD600', '#FFAC00'], // Yellow
];

export default function Avatar({ name, size = '100%' }: { name: string, size?: string | number }) {
    // Deterministic random based on name
    const hash = useMemo(() => {
        let h = 0;
        for (let i = 0; i < name.length; i++) {
            h = Math.imul(31, h) + name.charCodeAt(i) | 0;
        }
        return Math.abs(h);
    }, [name]);

    const colorPair = COLORS[hash % COLORS.length];
    const eyeType = hash % 3;
    const mouthType = hash % 3;

    return (
        <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={`grad-${hash}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colorPair[0]} />
                    <stop offset="100%" stopColor={colorPair[1]} />
                </linearGradient>
            </defs>

            {/* Background */}
            <circle cx="50" cy="50" r="50" fill={`url(#grad-${hash})`} />

            {/* Eyes */}
            {eyeType === 0 && (
                <g fill="white">
                    <circle cx="35" cy="40" r="6" />
                    <circle cx="65" cy="40" r="6" />
                </g>
            )}
            {eyeType === 1 && (
                <g stroke="white" strokeWidth="4" strokeLinecap="round">
                    <path d="M28 42 Q35 35, 42 42" />
                    <path d="M58 42 Q65 35, 72 42" />
                </g>
            )}
            {eyeType === 2 && (
                <g fill="white">
                    <rect x="28" y="38" width="12" height="4" rx="2" />
                    <rect x="60" y="38" width="12" height="4" rx="2" />
                </g>
            )}

            {/* Mouth */}
            {mouthType === 0 && (
                <path d="M35 65 Q50 75, 65 65" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
            )}
            {mouthType === 1 && (
                <circle cx="50" cy="65" r="5" fill="white" />
            )}
            {mouthType === 2 && (
                <path d="M35 60 Q50 75, 65 60" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
            )}

            {/* Detail/Cheeks */}
            <circle cx="30" cy="55" r="3" fill="rgba(255,255,255,0.2)" />
            <circle cx="70" cy="55" r="3" fill="rgba(255,255,255,0.2)" />
        </svg>
    );
}
