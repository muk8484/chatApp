import { useState, useEffect } from 'react';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MessageContainer from '../components/MessageContainer';
import InputField from '../components/InputField';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import { userAtom } from '../store/LoginStore';
import { messageListAtom, messageListenerAtom, sendMessageAtom, sendEmojiMessageAtom, emojiMessageListenerAtom } from '../store/ChatStore';

function ChatPage() {
  const isDarkMode = useColorScheme() === 'dark';
  const [message, setMessage] = useState('');
  const [messageCopy, setMessageCopy] = useState('');
  const messageList = useAtomValue(messageListAtom);
  const [, initMessageListener] = useAtom(messageListenerAtom);
  const [, initEmojiMessageListener] = useAtom(emojiMessageListenerAtom);
  const [, sendMessage] = useAtom(sendMessageAtom);
  const [, sendEmojiMessage] = useAtom(sendEmojiMessageAtom);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    const unsubscribe = initMessageListener();
    const emojiUnsubscribe = initEmojiMessageListener();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (emojiUnsubscribe) {
        emojiUnsubscribe();
      }
    };
  }, [initMessageListener, initEmojiMessageListener]);

  useEffect(() => {
    console.log('[ChatPage] messageList: ', messageList.length);
  }, [messageList]);

  const sendMessageAction = async () => {
    if (!message.trim()) return;
    const messageId = uuidv7();
    const currentMessage = message;
    setMessage('');
    try {
      console.log('[ChatPage] user : ', user);
      console.log('[ChatPage] messageId : ' + messageId);
      await sendMessage(currentMessage, messageId);
      await sendEmojiMessage(currentMessage, user, messageId);
    } catch (error) {
      console.error('[ChatPage] sendMessage error:', error);
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.messageContainer}>
          <MessageContainer 
            messageList={messageList}
            user={user}
          />
        </View>
        <InputField
          message={message}
          setMessage={setMessage}
          sendMessageFunction={sendMessageAction}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#f4511e',
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    backgroundColor: '#E5DAD4',
  }
});

export default ChatPage;