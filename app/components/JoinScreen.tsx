'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '@/context/SocketContext';

export default function JoinScreen() {
    const [name, setName] = useState('');
    const { joinGame } = useSocket();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            joinGame(name.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-10 flex flex-col items-center justify-center p-8 w-full max-w-md"
        >
            <div className="glass-panel p-10 py-12 w-full flex flex-col items-center gap-8 mx-auto shadow-2xl">
                <h1 className="text-4xl font-bold text-white glow-text text-center tracking-wide">
                    Lansiranje 2026
                </h1>
                <p className="text-gray-300 text-center mb-2 text-lg">
                    Upiši ime da se pridružiš ekipi
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tvoje Ime"
                        className="w-full bg-black/40 border-2 border-white/20 rounded-xl px-4 py-4 text-white text-xl placeholder:text-gray-500 focus:outline-none transition-all duration-300 input-glow text-center font-medium"
                        autoFocus
                    />

                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(188, 19, 254, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-[--neon-blue] to-[--neon-purple] text-white font-bold py-6 px-4 rounded-xl uppercase tracking-widest shadow-lg border-2 border-white/20 relative overflow-hidden group mt-6"
                        type="submit"
                    >
                        <span className="relative z-10 text-xl drop-shadow-md px-12">Upadaj</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
