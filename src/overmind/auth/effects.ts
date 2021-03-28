import { CookieAuth, User } from '.';
import { clearCookieKey, readCookieKey, updateCookieKey } from '../../utils/cookie';
import config from '../../config';

interface ILoginResponse {
  payload: { login: 'success'; user: User; expiry: string } | { login: 'failed'; error: any };
}
export const api = {
  login: async (username: string, password: string): Promise<ILoginResponse> => {
    if (username === 'a@b.c' && password === '123456')
      return {
        payload: {
          login: 'success',
          user: {
            username: 'a@b.c',
            roles: ['user'],
            token: 'tok3n',
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

  getTokenFromCode: async (code: string): Promise<User> =>
    fetch(config.proxy_url, { method: 'POST', body: JSON.stringify({ code }) })
      .then(res => res.json())
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
