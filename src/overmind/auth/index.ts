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
  roles: string[];
};

export type CookieAuth = {
  user: User;
  expiry: Date;
};

export default config;
