import { initState } from './state';
import * as actions from './actions';
import * as effects from './effects';

const config = {
  state: initState,
  actions,
  effects,
};

export type User = {
  id: number;
  login: string;
  email: string;
  type: string;
  name: string;
  avatar_url?: string;
  company?: Nullable<string>;
  html_url?: string;
  location?: Nullable<string>;
  repos_url?: string;
};

export type CookieAuth = {
  user: User;
  token: string;
  expiry: Date;
};

export default config;
