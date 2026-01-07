'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
    id: string;
    name?: string;
    ready: boolean;
    color?: string;
}

interface GameState {
    status: 'LOBBY' | 'READY' | 'LAUNCHED';
    launchTime?: number;
}

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    users: User[];
    gameState: GameState;
    joinGame: (name: string) => void;
    setReady: () => void;
    triggerLaunch: () => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    users: [],
    gameState: { status: 'LOBBY' },
    joinGame: () => { },
    setReady: () => { },
    triggerLaunch: () => { },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [gameState, setGameState] = useState<GameState>({ status: 'LOBBY' });

    useEffect(() => {
        const socketInstance = io();

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        socketInstance.on('update_users', (updatedUsers: User[]) => {
            setUsers(updatedUsers);
        });

        socketInstance.on('game_state', (state: GameState) => {
            setGameState(state);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinGame = (name: string) => {
        if (socket) {
            socket.emit('join', { name });
        }
    };

    const setReady = () => {
        if (socket) {
            socket.emit('ready');
        }
    };

    const triggerLaunch = () => {
        if (socket) {
            socket.emit('launch_signal');
        }
    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                users,
                gameState,
                joinGame,
                setReady,
                triggerLaunch,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
