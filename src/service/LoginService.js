import socket from '../utils/server';

const loginService = {
  async login(email){
    return new Promise((resolve, reject) => {
      try {
        if (!socket.connected) {
            console.log('[loginService] disconnected');
            socket.connect();
        }
        socket.emit('login', email, (response) => {
          console.log('[loginService] login_response', response);
          if (response?.ok) {
            console.log('[loginService] login_response ok');
            resolve(response);
          } else {
            reject(new Error(response?.error || '로그인에 실패했습니다.'));
          }
        });
      } catch (error) {
        console.error('[loginService]Socket error: ', error);
        reject(new Error('서버 연결에 실패했습니다.'));
      }
    });
  }
};

const logoutService = {
    logout: async () => {
      return new Promise((resolve, reject) => {
        try {
          socket.emit('logout', (response) => {
            console.log('[logoutService] logout_response ');
            if (response?.ok) {
              resolve(response);
            } else {
              reject(new Error(response?.error || '로그아웃에 실패했습니다.'));
            }
          });
        } catch (error) {
          console.error('[logoutService] Socket error:', error);
          reject(new Error('서버 연결에 실패했습니다.'));
        }
      });
    }
  };

export { loginService, logoutService };