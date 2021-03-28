import { initState } from './state';
import * as actions from './actions';
import * as effects from './effects';

const config = {
  state: initState,
  actions,
  effects,
};

export type User = {
  username: string;
};

export type CookieAuth = {
  user: User;
  token: string;
  expiry: Date;
};

export default config;
