import { formatISO, addDays } from 'date-fns';

import { CookieAuth, IDP_TYPE, User } from '.';
import { clearCookieKey, readCookieKey, updateCookieKey } from '../../utils/cookie';
import config from '../../config';

interface ILoginResponse {
  payload:
    | {
        login: 'success';
        user: User;
        token: string;
        expiry: string;
      }
    | {
        login: 'failed';
        error: any;
      };
}

export const api = {
  login: async (username: string, password: string): Promise<ILoginResponse> => {
    if (username === 'a@b.c' && password === '123456')
      return {
        payload: {
          login: 'success',
          user: {
            id: 0,
            login: 'a',
            email: 'a@b.c',
            name: 'A',
            type: 'User',
          },
          token: 'tok3n',
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

  getTokenFromIdp: async (idp: IDP_TYPE, code: string): Promise<ILoginResponse> => {
    const url = idp === 'github' ? config.githubProxyUrl : config.customProxyUrl;

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((res) => ({
        payload: {
          login: 'success' as const,
          user: res.user,
          token: res.token,
          expiry: formatISO(addDays(new Date(), 7)),
        },
      }))
      .catch((error) => ({
        payload: {
          login: 'failed' as const,
          error: error,
        },
      }));
  },
};

export const cookieAuth = {
  read: async (): Promise<Nullable<CookieAuth>> => {
    const cookieAuthStr = readCookieKey('auth_github');
    const cookieAuthParse = cookieAuthStr ? JSON.parse(cookieAuthStr) : null;

    return {
      user: cookieAuthParse.user,
      token: cookieAuthParse.token,
      expiry: new Date(Date.parse(cookieAuthParse.expiry)),
    };
  },
  set: async (cookieAuth: CookieAuth): Promise<void> => {
    console.log('=> effect write cookie');
    updateCookieKey('auth_github', JSON.stringify(cookieAuth), cookieAuth.expiry);
  },
  clear: async (): Promise<void> => {
    console.log('=> effect clear cookie');
    clearCookieKey('auth_github');
  },
};
