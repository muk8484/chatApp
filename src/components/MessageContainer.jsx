import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';

const MessageContainer = ({ messageList, user }) => {
  const flatListRef = useRef(null);
  const [loadingEmojiId, setLoadingEmojiId] = useState(null);
  const isMyMessage = (messageUser) => user?.name === messageUser?.name;
  const isSystemMessage = (messageUser) => messageUser?.name === "system";

  const isOnlyEmoji = (text) => {
    const emojiRegex = /^[\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27FF\u2B50\u2B55]+$/;
    return emojiRegex.test(text);
  };

  const getMessageStyle = (messageUser, text) => {
    if (isSystemMessage(messageUser)) {
      return styles.systemMessage;
    }
    if (isOnlyEmoji(text)) {
      return styles.emojiMessage;
    }
    return isMyMessage(messageUser) ? styles.myMessage : styles.otherMessage;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // 메시지 리스트가 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    const lastMessage = messageList[messageList.length - 1];
    if (lastMessage && isOnlyEmoji(lastMessage.chat)) {
      setLoadingEmojiId(lastMessage._id);
      setTimeout(() => {
        setLoadingEmojiId(null);
      }, 1000);
    }

    if (flatListRef.current && messageList.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messageList]);



  const renderItem = ({ item }) => {
    //console.log('Rendering message:', item); // 디버깅용 로그
    if (!item) return null;

    if (isOnlyEmoji(item.chat)) {
      const isLoading = loadingEmojiId === item._id;
      return (
        <View style={[
          styles.emojiContainer,
          isMyMessage(item.user) ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }
        ]}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
          ) : (
            <Text style={styles.emojiText}>{item.chat}</Text>
          )}
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        getMessageStyle(item.user, item.chat)
      ]}>
        {!isMyMessage(item.user) && !isSystemMessage(item.user) && item.user?.name && (
          <Text style={styles.userName}>{item.user.name}</Text>
        )}
        <Text style={[
          styles.messageText,
          isSystemMessage(item.user) && styles.systemMessageText
        ]}>
          {item.chat}
        </Text>
        {!isSystemMessage(item.user) && item.createdAt && (
          <Text style={styles.timeText}>
            {formatTime(item.createdAt)}
          </Text>
        )}
      </View>
    );
  };
  
  return (
    <FlatList
      ref={flatListRef}
      data={messageList || []}
      style={styles.container}
      keyExtractor={(item) => item._id || String(Math.random())}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      renderItem={renderItem}
      removeClippedSubviews={false}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );

  // return (
  //   <FlatList
  //     ref={flatListRef}
  //     data={messageList}
  //     style={styles.container}
  //     // keyExtractor={(item, index) => index.toString()}
  //     keyExtractor={(item) => item._id || String(Math.random())}
  //     onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
  //     onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
  //     renderItem={({ item }) => {
  //       // 이모티콘만 있는 경우의 렌더링
  //       if (isOnlyEmoji(item.chat)) {
  //         return (
  //           <View style={[
  //             styles.emojiContainer,
  //             isMyMessage(item.user) ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }
  //           ]}>
  //             <Text style={styles.emojiText}>{item.chat}</Text>
  //             {!isSystemMessage(item.user) && item.createdAt && (
  //             <Text style={styles.timeText}>
  //               {formatTime(item.createdAt)}
  //             </Text>
  //           )}
  //           </View>
  //         );
  //       }

  //       // 일반 메시지의 렌더링
  //       return (
  //         <View style={[
  //           styles.messageContainer,
  //           getMessageStyle(item.user, item.chat)
  //         ]}>
  //           {!isMyMessage(item.user) && !isSystemMessage(item.user) && (
  //             <Text style={styles.userName}>{item.user.name}</Text>
  //           )}
  //           <Text style={[
  //             styles.messageText,
  //             isSystemMessage(item.user) && styles.systemMessageText
  //           ]}>
  //             {item.chat}
  //           </Text>
  //           {!isSystemMessage(item.user) && item.createdAt && (
  //             <Text style={styles.timeText}>
  //               {formatTime(item.createdAt)}
  //             </Text>
  //           )}
  //         </View>
  //       );
  //     }}
  //   />
  // );
};
//       renderItem={({ item }) => ( 
//         <View style={[
//           styles.messageContainer,
//           getMessageStyle(item.user)
//         ]}>
//           {/* 일반 사용자 메시지일 때만 사용자 이름 표시 */}
//           {!isMyMessage(item.user) && !isSystemMessage(item.user) && (
//             <Text style={styles.userName}>{item.user.name}</Text>
//           )}
//           <Text style={[
//             styles.messageText,
//             isSystemMessage(item.user) && styles.systemMessageText,
//             isOnlyEmoji(item.chat) && styles.emojiText
//           ]}>
//             {item.chat}
//           </Text>
//           {/* 시스템 메시지가 아닐 때만 시간 표시 */}
//           {!isSystemMessage(item.user) && item.createdAt && !isOnlyEmoji(item.chat) && (
//             <Text style={styles.timeText}>
//               {formatTime(item.createdAt)}
//             </Text>
//           )}
//         </View>
//       )}
//     />
//   );
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  emojiMessage: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    maxWidth: '90%',
    padding: 2,
  },
  emojiText: {
    fontSize: 40,  // 이모지 크기 조절
    lineHeight: 50,
    textAlign: 'center',
  },
  messageContainer: {
    maxWidth: '70%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 5,
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    maxWidth: '90%',
  },
  userName: {
    fontSize: 12,
    marginBottom: 4,
    color: '#666',
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  systemMessageText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  }
});

export default MessageContainer;