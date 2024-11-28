import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Header = () => (
    <>
      <Text style={styles.title}>로그인</Text>
      <Text style={styles.subtitle}>계속하려면 로그인하세요.</Text>
    </>
  );
  
  const Form = ({ email, setEmail, handleLogin }) => (
    <>
      <TextInput
        style={styles.input}
        placeholder="이메일 주소"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
    </>
  );
  
  const Footer = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>계정이 없으신가요?</Text>
      <TouchableOpacity>
        <Text style={styles.footerLink}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
  
  const LoginContainer = ({ email, setEmail, handleLogin }) => {
    return (
      <View style={styles.container}>
        <Header />
        <Form 
          email={email}
          setEmail={setEmail}
          handleLogin={handleLogin}
        />
        <Footer />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: '#FFFFFF',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      fontSize: 16,
      color: '#333',
      backgroundColor: '#F9F9F9',
    },
    button: {
      backgroundColor: '#333',
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    footerText: {
      color: '#666',
      fontSize: 16,
    },
    footerLink: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
    },
  });
  
  export default LoginContainer;