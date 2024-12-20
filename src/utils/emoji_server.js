import { io } from "socket.io-client";
const EMOJI_SOCKET_URL = 'http://192.168.1.131:5002';
const emojiSocket = io(EMOJI_SOCKET_URL, {
    transports: ['websocket'], // websocket만 사용하도록 강제
    upgrade: false, // polling에서 웹소켓으로 업그레이드하지 않음
    reconnectionAttempts: 5,
    timeout: 10000,
    forceNew: true
});

emojiSocket.on('connect', () => {
    console.log('Connected to emoji_server');
});

export default emojiSocket;