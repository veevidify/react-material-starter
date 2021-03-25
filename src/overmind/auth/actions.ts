import { Action, AsyncAction, rehydrate } from 'overmind';
import { CookieAuth, User } from '.';
import { initState } from './state';

interface ILoginReq {
  username: string;
  password: string;
  callback?: () => void;
}
export const login: AsyncAction<ILoginReq> = async (
  { effects, actions },
  { username, password, callback }
) => {
  console.log('=> action login');
  try {
    const loginRequest = await effects.auth.api.login(username, password);
    const { payload } = loginRequest;
    switch (payload.login) {
      case 'success':
        await actions.auth.authenticate({ user: payload.user, expiry: payload.expiry, callback });
        break;

      case 'failed':
        await actions.auth.deauth();
        break;
    }
  } catch {
    await actions.auth.deauth();
  }
};

export const logout: AsyncAction = async ({ effects, actions }) => {
  console.log('=> action logout');
  try {
    const logoutRequest = await effects.auth.api.logout();
    if (logoutRequest === true) await actions.auth.deauth();
  } catch {}
};

// === auth flow control === //

export const authenticate: AsyncAction<{
  user: User;
  expiry: string;
  callback?: () => void;
}> = async ({ actions }, { user, expiry, callback }) => {
  console.log('=> action authenticate');
  const cookieAuth = {
    user: user,
    expiry: new Date(Date.parse(expiry)),
  };
  await actions.auth.persistCookieAuth(cookieAuth);
  actions.auth.writeAuthToState({ user });
  if (callback) callback();
};

export const deauth: AsyncAction = async ({ actions }) => {
  await actions.auth.clearCookieAuth();
  actions.auth.clearAuthInState();
};

export const refreshAuthStateWithCookie: AsyncAction<void, boolean> = async ({
  effects,
  actions,
}) => {
  // read auth from cookie
  const cookieAuth: Nullable<CookieAuth> = await effects.auth.cookieAuth.read();
  let setAuth = true;
  if (cookieAuth === null) {
    setAuth = false;
  } else {
    // check expiry, if good, authenticate, if expire deauth
    const expiry = cookieAuth.expiry;
    if (expiry <= new Date()) {
      setAuth = false;
    } else actions.auth.writeAuthToState({ user: cookieAuth.user });
  }

  if (!setAuth) await actions.auth.deauth();
  return setAuth;
};

// === end auth flow control === //

// === auth utilities === //

// after login writes details into cookie
export const persistCookieAuth: AsyncAction<CookieAuth> = async ({ effects }, cookieAuth) => {
  console.log('=> action persist cookie auth');
  await effects.auth.cookieAuth.set(cookieAuth);
};

// wipe cookie auth
export const clearCookieAuth: AsyncAction = async ({ effects }) => {
  console.log('=> action clear cookie auth');
  await effects.auth.cookieAuth.clear();
};

// write auth details into overmind state
export const writeAuthToState: Action<{
  user: User;
}> = ({ state }, { user }) => {
  console.log('=> action load auth to state');
  state.auth.user = user;
  state.auth.token = 'tok3n';
};

// clear auth details from overmind state
export const clearAuthInState: Action = ({ state }) => {
  console.log('=> action clear auth from state');
  state.auth.user = null;
  state.auth.token = '';
};

// === end auth utilities === //
