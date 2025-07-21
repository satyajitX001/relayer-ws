//new WebScoket is the default js provided ws
import { WebSocketServer, WebSocket as WebSocketClient } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

interface Room {
    sockets: WebSocketClient[]
}

const rooms: Record<string, Room> = {
    // room1:{sockets:['ws1','ws2','ws3']} example rooms
}

const RELAYER_URL = "ws://localhost:3001";
const relayerSocket = new WebSocket(RELAYER_URL);

relayerSocket.onmessage = ({data}) => {
    try {
        const parsedData = JSON.parse(data)
        if (parsedData.type === 'chat') {
            const room = parsedData.room
            rooms[room]?.sockets.map((socket) => {
                socket.send(data)
            })
        }
    } catch (error) {
        console.log('Received non-JSON message from relayer:', data)
    }
}

//ws is the websocket connection per user i.e if 20 user connect 20 times ws called

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    console.log("web socket object", ws)
    ws.on('message', function message(data: string) {
        const parsedData = JSON.parse(data)
        if (parsedData.type === 'join-room') {
            const room = parsedData.room
            if (!rooms[room]) {
                rooms[room] = { sockets: [] }
            }
            rooms[room].sockets.push(ws)
        }
        if (parsedData.type === 'chat') {
            relayerSocket.send(data)
        }
    });
});