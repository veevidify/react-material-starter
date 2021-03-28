import { Action, AsyncAction, rehydrate } from 'overmind';
import { CookieAuth, User } from '.';

interface ILoginReq {
  username: string;
  password: string;
  callback: () => void;
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
        await actions.auth.authenticate({
          user: payload.user,
          token: payload.token,
          expiry: payload.expiry,
          callback,
        });
        break;

      case 'failed':
        await actions.auth.deauth({});
        break;
    }
  } catch {
    await actions.auth.deauth({});
  }
};

export const logout: AsyncAction<{
  callback: () => void;
}> = async ({ effects, actions }, { callback = () => {} }) => {
  console.log('=> action logout');
  try {
    const logoutRequest = await effects.auth.api.logout();
    if (logoutRequest === true) await actions.auth.deauth({ callback });
  } catch {}
};

export const authenticateWithCode: AsyncAction<{
  code: string;
  callback: () => void;
}> = async({ effects, actions }, { code, callback = () => {} }) => {
  console.log('=> action get token');
  try {
    const authRequest = await effects.auth.api.getTokenFromCode(code);
    const { payload } = authRequest;
    // condition here
    switch (payload.login) {
      case 'success':
        await actions.auth.authenticate({
          user: payload.user,
          token: payload.token,
          expiry: payload.expiry,
          callback
        });
        break;

      case 'failed':
        await actions.auth.deauth({});
        break;
    }
  } catch {
    await actions.auth.deauth({});
  }
};

// === auth flow control === //

export const authenticate: AsyncAction<{
  user: User;
  expiry: string;
  token: string;
  callback?: () => void;
}> = async ({ actions }, { user, expiry, token, callback = () => {} }) => {
  console.log('=> action authenticate');
  const cookieAuth = {
    user: user,
    token: token,
    expiry: new Date(Date.parse(expiry)),
  };
  await actions.auth.persistCookieAuth(cookieAuth);
  actions.auth.writeAuthToState({ user, token });
  callback();
};

export const deauth: AsyncAction<{ callback?: () => void }> = async ({ actions }, { callback = () => {} }) => {
  await actions.auth.clearCookieAuth();
  actions.auth.clearAuthInState();
  callback();
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
    } else actions.auth.writeAuthToState({ user: cookieAuth.user, token: cookieAuth.token });
  }

  if (!setAuth) await actions.auth.deauth({});
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
  token: string;
}> = ({ state }, { user, token }) => {
  console.log('=> action load auth to state');
  state.auth.user = user;
  state.auth.token = token;
};

// clear auth details from overmind state
export const clearAuthInState: Action = ({ state }) => {
  console.log('=> action clear auth from state');
  state.auth.user = null;
  state.auth.token = '';
};

// === end auth utilities === //
