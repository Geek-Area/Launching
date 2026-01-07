'use client';

import { motion } from 'framer-motion';
import { useSocket } from '@/context/SocketContext';

export default function TheButton() {
    const { triggerLaunch, users, socket } = useSocket();

    const myUser = users.find(u => u.id === socket?.id);
    const isReady = myUser?.ready || false;

    return (
        <div className="z-10 flex flex-col items-center gap-8">
            <div className="relative">
                {/* Glow behind */}
                <div className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-500
            ${isReady ? 'bg-[--neon-pink] opacity-40' : 'bg-[--neon-blue] opacity-20'}
        `} />

                <motion.button
                    onClick={triggerLaunch}
                    disabled={isReady}
                    whileHover={!isReady ? { scale: 1.05 } : {}}
                    whileTap={!isReady ? { scale: 0.95 } : {}}
                    animate={isReady ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ repeat: isReady ? Infinity : 0, duration: 2 }}
                    className={`
            relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 flex items-center justify-center
            text-3xl md:text-5xl font-bold tracking-widest uppercase transition-all duration-300
            ${isReady
                            ? 'bg-[--neon-pink] border-[--neon-pink] text-white shadow-[0_0_80px_var(--neon-pink)]'
                            : 'bg-transparent border-[--neon-blue] text-[--neon-blue] hover:bg-[rgba(0,243,255,0.1)] hover:shadow-[0_0_50px_var(--neon-blue)]'}
          `}
                >
                    {isReady ? 'SPREMAN/A' : 'SPREMAN?'}
                </motion.button>
            </div>

            <p className="text-[--text-dim] text-lg font-medium">
                {Object.values(users).filter(u => u.ready).length} / {users.length} Spremnih
            </p>
        </div>
    );
}
