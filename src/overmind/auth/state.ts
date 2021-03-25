import { User } from '.';

type State = {
  user: Nullable<User>;
  token: Nullable<string>;
};

export const initState: State = {
  user: null,
  token: null,
};
