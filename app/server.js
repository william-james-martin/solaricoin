const WebSocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : [];

class SolariServer {
    constructor(solarichain) {
        this.solarichain = solarichain;
        this.sockets = [];
    }

    listen() {
        const server = new WebSocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();

        console.log(`Listening for connections on ${P2P_PORT}`);
    }

    connectToPeers() {
        PEERS.forEach(peer => {
            const socket = new WebSocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);

        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            console.log('Existing chain:\n', data);

            this.solarichain.replace(data);
        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.solarichain.chain));
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}

module.exports = SolariServer
