import { WebSocketServer } from 'ws';
import http from 'http';

export default class MyWebSocketServer extends WebSocketServer {
    constructor(server: http.Server) {
        super({ server, path: '/events/' });

        this.on('connection', (ws, req) => {
            console.log(`new connection: ${req.url}`);

            ws.on('message', (msg) => {
                console.log('received message:', msg.toString());
            });

            ws.on('close', () => {
                console.log('connection closed.');
            });
        });

    }
}
