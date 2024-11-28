import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/pages/LoginPage';
import ChatPage from './src/pages/ChatPage';
import { useAtomValue, useSetAtom } from 'jotai';
import { isLoginAtom, logoutAtom } from './src/store/LoginStore';

const Stack = createStackNavigator();

function LogoutButton() {
  const logout = useSetAtom(logoutAtom);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleLogout}
      style={{ marginRight: 10 }}
    >
      <Text style={{ color: '#000', fontSize: 16 }}>로그아웃</Text>
    </TouchableOpacity>
  );
}

function App(){
  const isLogin = useAtomValue(isLoginAtom);
  const navigationRef = useRef<any>(null); // NavigationContainerRef 사용 대신 any로 설정


  useEffect(() => {
    if (navigationRef.current && isLogin !== undefined) {
      // 현재 화면과 다른 경우에만 navigate 호출
      const currentRouteName = navigationRef.current.getCurrentRoute()?.name;
      const targetRouteName = isLogin ? 'Chat' : 'Login';

      if (currentRouteName !== targetRouteName) {
        navigationRef.current.navigate(targetRouteName);
      }
    }
  }, [isLogin]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatPage}
          options={{
            title: '채팅',
            headerLeft: () => null,
            headerRight: () => <LogoutButton/>,
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;