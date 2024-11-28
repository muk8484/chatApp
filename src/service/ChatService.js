import socket from '../utils/server';

const MessageListenerService = {
    getMessage(callback) {
        // 기존 리스너 제거
        socket.off('message');

        // 새로운 리스너 등록
        socket.on('message', (message) => {
            console.log('[ChatService] message received:', message);
            callback(message);
        });

        // 클린업 함수 반환
        return () => {
            console.log('[ChatService] cleanup message listener');
            socket.off('message');
        };
    }
};

const MessageService = {
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            socket.emit('sendMessage', message, (response) => {
                if (response.ok) {
                    resolve();
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    }
};

export { MessageListenerService, MessageService };