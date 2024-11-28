import { useState } from 'react';
import { Alert } from 'react-native';
import { useAtom } from 'jotai';
import { loginAtom } from '../store/LoginStore';
import LoginContainer from '../components/LoginContainer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [, loginAction] = useAtom(loginAtom);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    try {
      if (!email.trim()) {
        Alert.alert('알림', '이메일을 입력해주세요.');
        return;
      }

      // if (!validateEmail(email)) {
      //   Alert.alert('알림', '올바른 이메일 형식이 아닙니다.');
      //   return;
      // }

      // store의 login 액션 호출
      await loginAction(email);
      
    } catch (error) {
      console.log('error', error.message);
      Alert.alert('오류','로그인에 실패했습니다.');
    }
  };

  return (
    <LoginContainer 
      email={email}
      setEmail={setEmail}
      handleLogin={handleLogin}
    />
  );
};

export default LoginPage;