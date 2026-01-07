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
        });

        socket.on('ready', () => {
            if (users[socket.id]) {
                users[socket.id].ready = true;
                io.emit('update_users', Object.values(users));

                // Check if all users are ready (simple logic for now)
                // In the final app, maybe we want 'launch_signal' to be the trigger users do together
            }
        });

        socket.on('launch_signal', () => {
            // This will be triggered when users click the button?
            // Or is it a collective thing?
            // Per request: "svi zajedno treba da kliknemo dugme"

            if (users[socket.id]) {
                users[socket.id].ready = true; // "Clicking" means ready/acting
                io.emit('update_users', Object.values(users));

                checkWinCondition(io);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            delete users[socket.id];
            io.emit('update_users', Object.values(users));

            // If empty, reset game maybe?
            if (Object.keys(users).length === 0) {
                gameState.status = 'LOBBY';
            }
        });
    });
};

const checkWinCondition = (io: Server) => {
    const userList = Object.values(users);
    if (userList.length === 0) return;

    const allReady = userList.every(u => u.ready);

    if (allReady && gameState.status !== 'LAUNCHED') {
        gameState.status = 'LAUNCHED';
        gameState.launchTime = Date.now();
        io.emit('game_state', gameState);
        console.log('ROCKET LAUNCHED!');

        // Reset after 10 seconds?
        // Reset logic removed per request. Game stays in 'LAUNCHED' state until server restart.
        // setTimeout(() => {
        //     gameState.status = 'LOBBY';
        //     userList.forEach(u => u.ready = false);
        //     io.emit('game_state', gameState);
        //     io.emit('update_users', Object.values(users));
        // }, 10000);
    }
};
