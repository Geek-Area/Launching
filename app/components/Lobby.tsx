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

function UserBubble({ user, index, windowSize }: { user: any, index: number, windowSize: any }) {
    // Determine strict boundaries
    const padding = 80; // Safe zone from edges
    const safeWidth = Math.max(100, windowSize.width - padding * 2);
    const safeHeight = Math.max(100, windowSize.height - padding * 2);

    // Random position within safe zone
    const baseX = padding + Math.random() * safeWidth;
    const baseY = padding + Math.random() * safeHeight;

    return (
        <motion.div
            initial={{ x: baseX, y: baseY, scale: 0, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 0.8,
                // Gentle floating that STAYS within bounds approximately
                y: [baseY, baseY - 30, baseY + 30, baseY],
                x: [baseX, baseX + 20, baseX - 20, baseX],
            }}
            transition={{
                delay: index * 0.1,
                y: { duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 7 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute flex flex-col items-center gap-2 z-0"
            style={{ left: 0, top: 0 }}
        >
            <div
                className={`w-20 h-20 rounded-full flex items-center justify-center p-1 shadow-lg bg-black/40
          ${user.ready ? 'ring-4 ring-[--neon-pink] shadow-[0_0_30px_var(--neon-pink)]' : 'ring-2 ring-[--glass-border]'}
        `}
                style={{
                    border: '2px solid rgba(255,255,255,0.2)'
                }}
            >
                <Avatar name={user.name} />
            </div>
            <span className="text-sm font-medium bg-black/50 px-2 py-1 rounded-full backdrop-blur-md text-white">
                {user.name}
            </span>
        </motion.div>
    );
}
