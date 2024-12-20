import socket from '../utils/server';
import emojiSocket from '../utils/emoji_server';

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

const EmojiMessageListenerService = {
    getMessage(callback) {
        // 기존 리스너 제거
        emojiSocket.off('emoji');

        // 새로운 리스너 등록
        emojiSocket.on('emoji', (message) => {
            console.log('[emohiChatService] message received:', message);
            callback(message);
        });

        // 클린업 함수 반환
        return () => {
            console.log('[ChatService] cleanup message listener');
            socket.off('emoji');
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

const emoji_MessageService = {
    sendMessage(message, user) {
        return new Promise((resolve, reject) => {
            emojiSocket.emit('sendMessage', message, user, (response) => {
                console.log('[ChatService] emoji_message received:', response);
                if (response.ok) {
                    resolve();
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    }
};

export { MessageListenerService, MessageService, emoji_MessageService, EmojiMessageListenerService };