'use client';

import { motion } from 'framer-motion';
import { useSocket } from '@/context/SocketContext';
import { useEffect, useState } from 'react';

export default function Lobby() {
    const { users } = useSocket();
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (users.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {users.map((user, i) => (
                <UserBubble key={user.id} user={user} index={i} windowSize={windowSize} totalUsers={users.length} />
            ))}
        </div>
    );
}

import Avatar from './Avatar';

// ... (previous imports)

function UserBubble({ user, index, windowSize, totalUsers }: { user: any, index: number, windowSize: any, totalUsers: number }) {
    // Dynamic sizing based on user count
    // Default 80px (w-20), shrinks down to ~40px as users increase
    const baseSizePx = Math.max(48, 100 - totalUsers * 2);

    // Center avoidance logic (Polar coordinates)
    const centerX = windowSize.width / 2;
    const centerY = windowSize.height / 2;

    // Minimum distance from center (keep text clear)
    const minRadius = Math.min(windowSize.width, windowSize.height) * 0.25;
    // Maximum distance (keep on screen with padding)
    const padding = 60;
    const maxRadiusX = (windowSize.width / 2) - padding;
    const maxRadiusY = (windowSize.height / 2) - padding;

    // Random angle
    const angle = Math.random() * Math.PI * 2;

    // Random radius between min and max
    // Correcting for aspect ratio to fill screen better
    const radiusNorm = Math.random(); // 0 to 1
    const rX = minRadius + radiusNorm * (maxRadiusX - minRadius);
    const rY = minRadius + radiusNorm * (maxRadiusY - minRadius);

    // Calculate base position
    const baseX = centerX + Math.cos(angle) * rX - (baseSizePx / 2);
    const baseY = centerY + Math.sin(angle) * rY - (baseSizePx / 2);

    return (
        <motion.div
            initial={{ x: baseX, y: baseY, scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 0.8,
                // Gentle floating
                y: [baseY, baseY - 20, baseY + 20, baseY],
                x: [baseX, baseX + 15, baseX - 15, baseX],
            }}
            transition={{
                delay: index * 0.1,
                y: { duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 7 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute flex flex-col items-center gap-1 z-0"
            style={{ left: 0, top: 0 }}
        >
            <div
                className={`rounded-full flex items-center justify-center p-1 shadow-lg bg-black/40 transition-all duration-500
          ${user.ready ? 'ring-4 ring-[--neon-pink] shadow-[0_0_30px_var(--neon-pink)]' : 'ring-2 ring-[--glass-border]'}
        `}
                style={{
                    width: baseSizePx,
                    height: baseSizePx,
                    border: '2px solid rgba(255,255,255,0.2)'
                }}
            >
                <Avatar name={user.name} />
            </div>
            <span className="text-xs font-medium bg-black/50 px-2 py-1 rounded-full backdrop-blur-md text-white whitespace-nowrap">
                {user.name}
            </span>
        </motion.div>
    );
}
