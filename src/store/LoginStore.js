import { atom } from 'jotai';
import { loginService, logoutService, emailAuthRequestService } from '../service/LoginService';

const isLoginAtom = atom(false);
const userAtom = atom(null);

const loginAtom = atom(
  null,
  async (get, set, email, authCode) => {
    try {
      console.log('[loginStore] loginAtom email: ', email, authCode);
      const response = await loginService.login(email, authCode);
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
      console.error('[loginStore] 로그인 오류: ', error.message);
      throw error;
    }
  }
);

const logoutAtom = atom(
    null,
    async (get, set) => {
      const user = get(userAtom);
      console.log('[loginStore] logoutAtom user : ', user);
      try {
        const response = await logoutService.logout(user);
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

const emailAuthRequestAtom = atom(
  null,
  async (get, set, email) => {
    try {
      const response = await emailAuthRequestService.requestEmailAuth(email);
      if (response.ok) {
        console.log('[loginStore] email auth request success ' , response);
        return response;
      } else {
        console.log('[loginStore] email auth request failed');
        throw new Error(response.error || '이메일 인증 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('[loginStore] email auth request error:', error.message);
      throw error;
    }
  }
);

export { isLoginAtom, userAtom, loginAtom, logoutAtom, emailAuthRequestAtom };