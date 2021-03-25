import { initState } from './state';
import * as actions from './actions';
import * as effects from './actions';

const config = {
  state: initState,
  actions,
  effects,
};

export default config;
