import { Server, Socket } from 'socket.io';

interface User {
    id: string;
    name: string;
    ready: boolean;
    color: string;
}

interface GameState {
    status: 'LOBBY' | 'READY' | 'LAUNCHED';
    launchTime?: number;
}

let users: Record<string, User> = {};
let gameState: GameState = { status: 'LOBBY' };

const COLORS = ['#FF0055', '#00FF99', '#00CCFF', '#FFAA00', '#CC00FF', '#FFFF00'];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const evaluateGameState = (io: Server) => {
    const userList = Object.values(users);

    // If no users, reset to LOBBY
    if (userList.length === 0) {
        if (gameState.status !== 'LOBBY') {
            gameState.status = 'LOBBY';
            io.emit('game_state', gameState);
        }
        return;
    }

    const allReady = userList.every(u => u.ready);

    if (allReady && gameState.status !== 'LAUNCHED') {
        // All users ready -> LAUNCH
        gameState.status = 'LAUNCHED';
        gameState.launchTime = Date.now();
        io.emit('game_state', gameState);
        console.log('ROCKET LAUNCHED!');
    } else if (!allReady && gameState.status === 'LAUNCHED') {
        // Not all ready (e.g. new user joined) -> RESET to LOBBY
        gameState.status = 'LOBBY';
        io.emit('game_state', gameState);
        console.log('Launch aborted / Reset to Lobby');
    }
};

export const setupSocketHandlers = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Initial state
        socket.emit('game_state', gameState);
        socket.emit('update_users', Object.values(users));

        socket.on('join', ({ name }: { name: string }) => {
            users[socket.id] = {
                id: socket.id,
                name: name || `User ${socket.id.substr(0, 4)}`,
                ready: false,
                color: getRandomColor(),
            };

            io.emit('update_users', Object.values(users));
            evaluateGameState(io); // Check if this new unready user affects state
        });

        socket.on('ready', () => {
            if (users[socket.id]) {
                users[socket.id].ready = true;
                io.emit('update_users', Object.values(users));
                evaluateGameState(io);
            }
        });

        socket.on('launch_signal', () => {
            if (users[socket.id]) {
                users[socket.id].ready = true;
                io.emit('update_users', Object.values(users));
                evaluateGameState(io);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            delete users[socket.id];
            io.emit('update_users', Object.values(users));
            evaluateGameState(io); // Check if leaving user affects state
        });
    });
};
