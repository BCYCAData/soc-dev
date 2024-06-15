import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { Server } from 'socket.io';

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss(),
		{
			name: 'sveltekit-socket-io',
			configureServer(server) {
				// Ensure server.httpServer is not null before creating a new Server instance
				if (server.httpServer) {
					const io = new Server(server.httpServer);
					if (!io) throw new Error('Socket.IO not injected');

					io.on('connection', (socket) => {
						if (!socket) throw new Error('Invalid Socket.IO connection');

						// Generate a random username and send it to the client
						let username = `User ${Math.round(Math.random() * 999999)}`;
						socket.emit('name', username ?? '');

						// Receive incoming messages and broadcast them
						socket.on('message', (message) => {
							if (!io) throw new Error('Socket.IO not injected');
							if (!message) throw new Error('Invalid message from client');
							if (!username) throw new Error('Username is null');

							io.emit('message', {
								from: username,
								message: message,
								time: new Date().toLocaleString()
							});
						});
					});

					console.log('SocketIO injected');
				} else {
					console.error('HTTP server is not available');
				}
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
