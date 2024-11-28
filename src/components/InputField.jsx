import React from 'react';
import { View, TextInput, Button, StyleSheet, Platform } from 'react-native';

const InputField = ({ message, setMessage, sendMessageFunction }) => {
  return (
    <View style={styles.inputContainer}>
      {/* <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="메시지를 입력하세요..."
      /> */}
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        multiline={true}
        textAlignVertical="center"
        // returnKeyType="send"
        returnKeyType='default'
        onSubmitEditing={sendMessageFunction}
        keyboardType={Platform.OS === 'ios' ? 'default' : 'email-address'}
        autoComplete="off"
        importantForAutofill="no"
        textContentType="none"
      />
      <Button title="전송" onPress={sendMessageFunction} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
    ...Platform.select({
      android: {
        paddingTop: 8,
        paddingBottom: 8,
      }
    })
  },
});

// const styles = StyleSheet.create({
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginRight: 10,
//   },
// });

export default InputField;