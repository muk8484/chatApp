import { io } from "socket.io-client";
const SOCKET_URL = 'http://server.deephigh.ai:5500';
// const SOCKET_URL = 'http://4gpu1.deephigh.net:5500';
// const SOCKET_URL = 'http://192.168.1.63:5001';
// const SOCKET_URL = 'http://192.168.219.101:5001';
const socket = io(SOCKET_URL, {
    transports: ['websocket'], // websocket만 사용하도록 강제
    upgrade: false, // polling에서 웹소켓으로 업그레이드하지 않음
    reconnectionAttempts: 5,
    timeout: 10000,
    forceNew: true
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('connect_error', (err) => {
    console.log('[Server] SOCKET_URL : ', SOCKET_URL);
    console.log('Connection error details:', err);
});   

socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
});

export default socket;