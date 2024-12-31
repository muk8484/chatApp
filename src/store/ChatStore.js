import { atom } from 'jotai';
import { MessageListenerService, MessageService, emoji_MessageService, EmojiMessageListenerService } from '../service/ChatService';

const messageListAtom = atom([]);

const addMessageAtom = atom(
  null,
  (get, set, newMessage) => {
    const currentMessages = get(messageListAtom);
    console.log('[ChatStore] addMessageAtom currentMessages : ', currentMessages);
    console.log('[ChatStore] addMessageAtom newMessage : ', typeof (newMessage.type));
    // 중복 메시지 체크
    // const isDuplicate = currentMessages.some(msg => (newMessage.user?.name !== 'system')&&(msg._id === newMessage._id));
    // if(!isDuplicate) {
    // }
    if(newMessage.type === 'emoji'){
      for(let i = currentMessages.length -1; i >= 0 ; i--){
        if(currentMessages[i].swapKey === newMessage.swapKey){
          // console.log('[ChatStore] addMessageAtom currentMessages[i]:', currentMessages);
          // const updatedMessages = currentMessages.map(msg => 
          //   msg.swapKey === newMessage.swapKey 
          //     ? { ...msg, type: 'text', chat: newMessage.chat } 
          //     : msg
          // );
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
      console.log('[ChatStore] emojiMessageListenerAtom message received:', message);
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