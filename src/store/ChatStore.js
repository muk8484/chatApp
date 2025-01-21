import { atom } from 'jotai';
import { MessageListenerService, MessageService, emoji_MessageService, EmojiMessageListenerService } from '../service/ChatService';

const messageListAtom = atom([]);

const addMessageAtom = atom(
  null,
  (get, set, newMessage) => {
    console.log('[ChatStore] addMessageAtom newMessage.type : ', newMessage.type);
    const currentMessages = get(messageListAtom);
    if(newMessage.type === 'image'){
      // 이미지 메시지 처리
      for(let i = currentMessages.length -1; i >= 0; i--) {
        if(currentMessages[i].swapKey === newMessage.swapKey) {
          console.log('[ChatStore] Image - Found loading message to replace');
          // 해당 인덱스의 메시지만 교체
          const updatedMessages = [
            ...currentMessages.slice(0, i),      // 교체 위치 이전의 메시지들
            newMessage,                          // 새 메시지
            ...currentMessages.slice(i + 1)      // 교체 위치 이후의 메시지들
          ];
          set(messageListAtom, updatedMessages);
          break;
        }
      }
    }
    else if(newMessage.type === 'emoji'){
      console.log('[ChatStore] emoji - Found loading message to replace');
      for(let i = currentMessages.length -1; i >= 0 ; i--){
        if(currentMessages[i].swapKey === newMessage.swapKey){
          const updatedMessages = [
            ...currentMessages.slice(0, i),
            { ...currentMessages[i], type: 'text', chat: newMessage.chat },
            ...currentMessages.slice(i + 1)
          ];
          set(messageListAtom, updatedMessages);
          break;
        }
      }
    } else {
      set(messageListAtom, [...currentMessages, newMessage]);
    }
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
      console.log('[ChatStore] emojiMessageListenerAtom message received:');
      set(addMessageAtom, message);
    });
  }
);

const sendMessageAtom = atom(
  null,
  async (get, set, message, messageId) => {
    try {
      await MessageService.sendMessage(message, messageId);
    } catch (error) {
      console.error('[ChatStore] sendMessage error:', error);
      throw error;
    }
  }
);

const sendEmojiMessageAtom = atom(
  null,
  async (get, set, message, user, messageId) => {
    try {
      await emoji_MessageService.sendMessage(message, user, messageId);
    } catch (error) {
      console.error('[ChatStore] sendEmojiMessage error:', error);
      throw error;
    }
  }
);

export { messageListAtom, addMessageAtom, messageListenerAtom, sendMessageAtom, sendEmojiMessageAtom, emojiMessageListenerAtom };