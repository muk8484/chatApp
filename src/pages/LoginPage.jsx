import { useState } from 'react';
import { Alert } from 'react-native';
import { useAtom } from 'jotai';
import { loginAtom, emailAuthRequestAtom } from '../store/LoginStore';
import LoginContainer from '../components/LoginContainer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [, loginAction] = useAtom(loginAtom);
  const [, emailAuthRequestAction] = useAtom(emailAuthRequestAtom);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCode = (code) => {
    const codeRegex = /^[0-9]{6}$/;
    return codeRegex.test(code);
  };

  const handleLogin = async () => {
    try {
      if (!email.trim()) {
        Alert.alert('알림', '이메일을 입력해주세요.');
        return;
      }

      // if (!code.trim()) {
      //   Alert.alert('알림', '이메일 인증 코드를 입력해주세요.');
      //   return;
      // }

      // if (!validateCode(code)) {
      //   Alert.alert('알림', '올바른 이메일 인증 코드가 아닙니다.');
      //   return;
      // }

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
      code={code}
      setCode={setCode}
      handleEmailAuthRequest={handleEmailAuthRequest}
    />
  );
};

export default LoginPage;