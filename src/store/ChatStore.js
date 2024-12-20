import { atom } from 'jotai';
import { MessageListenerService, MessageService, emoji_MessageService, EmojiMessageListenerService } from '../service/ChatService';

const messageListAtom = atom([]);

const addMessageAtom = atom(
  null,
  (get, set, newMessage) => {
    const currentMessages = get(messageListAtom);
    // 중복 메시지 체크
    // const isDuplicate = currentMessages.some(msg => (newMessage.user?.name !== 'system')&&(msg._id === newMessage._id));
    // if(!isDuplicate) {
    // }
    set(messageListAtom, [...currentMessages, newMessage]);
  }
);

const messageListenerAtom = atom(
  null,
  (get, set) => {
    return MessageListenerService.getMessage((message) => {
      set(addMessageAtom, message);
    });
  }
);

const emojiMessageListenerAtom = atom(
  null,
  (get, set) => {
    return EmojiMessageListenerService.getMessage((message) => {
      console.log('[ChatStore] emojiMessageListenerAtom message received:', message);
      set(addMessageAtom, message);
    });
  }
);

const sendMessageAtom = atom(
  null,
  async (get, set, message) => {
    try {
      await MessageService.sendMessage(message);
    } catch (error) {
      console.error('[ChatStore] sendMessage error:', error);
      throw error;
    }
  }
);

const sendEmojiMessageAtom = atom(
  null,
  async (get, set, message, user) => {
    try {
      await emoji_MessageService.sendMessage(message, user);
    } catch (error) {
      console.error('[ChatStore] sendEmojiMessage error:', error);
      throw error;
    }
  }
);

export { messageListAtom, addMessageAtom, messageListenerAtom, sendMessageAtom, sendEmojiMessageAtom, emojiMessageListenerAtom };