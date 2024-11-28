import { atom } from 'jotai';
import { MessageListenerService, MessageService } from '../service/ChatService';

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

export { messageListAtom, addMessageAtom, messageListenerAtom, sendMessageAtom };