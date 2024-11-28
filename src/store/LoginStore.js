import { atom } from 'jotai';
import { loginService, logoutService } from '../service/LoginService';

const isLoginAtom = atom(false);
const userAtom = atom(null);

const loginAtom = atom(
  null,
  async (get, set, email) => {
    try {
      const response = await loginService.login(email);
      // 로그인 성공 시 상태 업데이트
      if (response.ok) {
        console.log('[loginStore] login success');
        set(isLoginAtom, true);
        set(userAtom, response.data);

        // 상태 업데이트 확인을 위한 현재 값 읽기
        const currentIsLogin = get(isLoginAtom);
        const currentUser = get(userAtom);
        
        console.log('[loginStore] Updated states:', {
          isLogin: currentIsLogin,
          user: currentUser
        });
      } else {
        console.log('[loginStore] login failed');
        throw new Error(response.error || '로그인에 실패했습니다.');
      }
      return response;
    } catch (error) {
      console.error('로그인 오류:', error.message);
      throw error;
    }
  }
);

const logoutAtom = atom(
    null,
    async (get, set) => {
      try {
        const response = await logoutService.logout();
        if (response.ok) {
          set(isLoginAtom, false);
          set(userAtom, null);
          return response;
        } else {
          throw new Error(response.error || '로그아웃에 실패했습니다.');
        }
      } catch (error) {
        console.error('[loginStore] logout error:', error.message);
        throw error;
      }
    }
  );

export { isLoginAtom, userAtom, loginAtom, logoutAtom };