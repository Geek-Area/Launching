'use client';

import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import JoinScreen from './components/JoinScreen';
import Lobby from './components/Lobby';
import TheButton from './components/TheButton';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { isConnected, users, socket, gameState } = useSocket();
  const myUser = users.find(u => u.id === socket?.id);

  useEffect(() => {
    if (gameState.status === 'LAUNCHED') {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [gameState.status]);

  if (!isConnected) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--neon-blue]"></div>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!myUser ? (
          <JoinScreen key="join" />
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative flex items-center justify-center"
          >
            <Lobby />

            {gameState.status === 'LAUNCHED' ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="z-50 text-center flex flex-col items-center gap-6"
              >
                <div className="text-[100px] animate-bounce">
                  🛶
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white glow-text">
                  Sada nema nazad 🤓
                </h1>
                <p className="text-2xl md:text-3xl text-[--neon-blue] font-medium">
                  Srećno u 2026.
                </p>

                <div className="flex flex-col items-center gap-2 mt-2">
                  <p className="text-white/80 text-lg">
                    Lansiralo nas je: <span className="font-bold text-[--neon-pink] text-2xl">{users.length}</span> 🚀
                  </p>
                </div>

                <a
                  href="https://hub.geekarea.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-12 px-12 py-5 bg-white text-black font-bold rounded-full text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center gap-3"
                >
                  <span>Pridruži se zajednici</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
                <p className="text-sm text-[--text-dim] mt-8 uppercase tracking-widest">
                  YPC x Geek Area
                </p>
              </motion.div>
            ) : (
              <TheButton />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
