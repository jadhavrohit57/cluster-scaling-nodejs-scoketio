const app = require('express')();

const { Server } = require('socket.io');

const appServer = app.listen(8080, () => {
	console.log('server listening on port ', 8080, process.pid);
});
// Socket setup
const io = new Server(appServer, {
	transports: [ 'websocket' ], // only accept websocket as transport not long-polling
	cors: {
		credentials: true,
		origin: '*'
	}
});

io.on('connection', async (socket) => {
	try {
		const roomId = socket.handshake.query['roomId'];
		if (!roomId) {
			console.log('roomId not found');
			socket.emit('error', { message: 'provide roomId' });
			socket.disconnect();
			return;
		}

		socket.join(roomId);
		console.log('connected to node', process.pid);

		socket.on('message', (data) => {
			console.log({
				from: socket.id,
				data: data
			});
			io.to(roomId).emit('message', data);
		});

		socket.on('disconnect', () => {
			console.log('disconnected ', socket.id);
		});
	} catch (error) {}
});
