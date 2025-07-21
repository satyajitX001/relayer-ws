//here ws connection means all server of connecting to relayer only not client

import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3001 });

const server: WebSocket[] = []

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    //pushes every ws connection to server array
    server.push(ws)

    ws.on('message', function message(data: string) {
        console.log('message received', data)
        //filters out the current ws connection and sends the message to all other connections
        server.map(socket => socket.send(data))
    });
});