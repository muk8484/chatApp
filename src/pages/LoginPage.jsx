import { useState } from 'react';
import { Alert } from 'react-native';
import { useAtom } from 'jotai';
import { loginAtom, emailAuthRequestAtom } from '../store/LoginStore';
import LoginContainer from '../components/LoginContainer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [, loginAction] = useAtom(loginAtom);
  const [, emailAuthRequestAction] = useAtom(emailAuthRequestAtom);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCode = (authCode) => {
    const codeRegex = /^[0-9]{6}$/;
    return codeRegex.test(authCode);
  };

  const handleLogin = async () => {
    try {
      if (!email.trim()) {
        Alert.alert('알림', '이메일을 입력해주세요.');
        return;
      }

      if (!authCode.trim()) {
        Alert.alert('알림', '이메일 인증 코드를 입력해주세요.');
        return;
      }

      if (!validateCode(authCode)) {
        Alert.alert('알림', '올바른 이메일 인증 코드가 아닙니다.');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('알림', '올바른 이메일 형식이 아닙니다.');
        return;
      }

      // store의 login 액션 호출
      await loginAction(email, authCode);
      
    } catch (error) {
      console.log('error', error.message);
      // Alert.alert('오류','로그인에 실패했습니다.');
      Alert.alert('오류',error.message);
    }
  };

  const handleEmailAuthRequest = async () => {
    try {
      if (!email.trim()) {
        Alert.alert('알림', '이메일을 입력해주세요.');
        return;
      }
      const response = await emailAuthRequestAction(email);
      if (response.ok) {
        Alert.alert('알림', '이메일 인증 요청이 완료되었습니다.');
      }
    } catch (error) {
      console.log('error', error.message);
      Alert.alert('오류','이메일 인증 요청에 실패했습니다.');
    }
  };

  return (
    <LoginContainer 
      email={email}
      setEmail={setEmail}
      handleLogin={handleLogin}
      authCode={authCode}
      setAuthCode={setAuthCode}
      handleEmailAuthRequest={handleEmailAuthRequest}
    />
  );
};

export default LoginPage;