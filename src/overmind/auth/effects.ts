import { CookieAuth, User } from '.';
import { clearCookieKey, readCookieKey, updateCookieKey } from '../../utils/cookie';

interface ILoginResponse {
  payload: { login: 'success'; user: User; expiry: string } | { login: 'failed'; error: any };
}
export const api = {
  login: async (username: string, password: string): Promise<ILoginResponse> => {
    if (username === 'a' && password === '123456')
      return {
        payload: {
          login: 'success',
          user: {
            username: 'a',
            roles: ['user'],
          },
          expiry: '2022-01-01 00:00:00',
        },
      };
    else
      return {
        payload: {
          login: 'failed',
          error: true,
        },
      };
  },

  logout: async () => {
    return true;
  },
};

export const cookieAuth = {
  read: async (): Promise<Nullable<CookieAuth>> => {
    const cookieAuthStr = readCookieKey('auth');
    const cookieAuthParse = cookieAuthStr ? JSON.parse(cookieAuthStr) : null;

    return {
      user: cookieAuthParse.user,
      expiry: new Date(Date.parse(cookieAuthParse.expiry)),
    };
  },
  set: async (cookieAuth: CookieAuth): Promise<void> => {
    console.log('=> effect write cookie');
    updateCookieKey('auth', JSON.stringify(cookieAuth), cookieAuth.expiry);
  },
  clear: async (): Promise<void> => {
    console.log('=> effect clear cookie');
    clearCookieKey('auth');
  },
};
