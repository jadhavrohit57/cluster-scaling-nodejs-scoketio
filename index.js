const cluster = require('node:cluster');
const { availableParallelism } = require('node:os');
const process = require('node:process');

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {
	// Workers can share any TCP connection
	// In this case it is an HTTP server
	require('./socket');
}
