import { createOvermindMock } from 'overmind';
import { User } from '.';
import { config } from '../';
import { cookieAuth } from './effects';
import * as cookieHelper from '../../utils/cookie';

describe('Actions', () => {
  // == updating state == //

  describe('Sync Actions', () => {
    describe('writeAuthDetails', () => {
      test('should write correct auth details to state', () => {
        const overmindAuth = createOvermindMock(config);

        const user: User = {
          username: 'test',
          roles: ['test', 'test'],
        };
        overmindAuth.actions.auth.writeAuthToState({
          user: user,
        });

        expect(overmindAuth.state.auth).toHaveProperty('user');
        expect(overmindAuth.state.auth.user).toEqual(user);

        expect(overmindAuth.state.auth).toHaveProperty('token');
        expect(overmindAuth.state.auth.token).toEqual('tok3n');
      });
    });

    describe('clearAuthDetails', () => {
      test('should clear out auth details in state', () => {
        const overmindAuth = createOvermindMock(config);

        overmindAuth.actions.auth.clearAuthInState();

        expect(overmindAuth.state.auth).toHaveProperty('user');
        expect(overmindAuth.state.auth.user).toEqual(null);

        expect(overmindAuth.state.auth).toHaveProperty('token');
        expect(overmindAuth.state.auth.token).toEqual('');
      });
    });
  });

  // == Local Storage management == //

  describe('Local Storage Actions', () => {
    describe('persistCookieAuth', () => {
      test('should invoke effects set cookieAuth', async () => {
        const user: User = {
          username: 'test',
          roles: ['test', 'test'],
        };

        const overmindAuth = createOvermindMock(config, {
          auth: {
            cookieAuth: {
              set: () => Promise.resolve(),
              clear: () => Promise.resolve(),
            },
          },
        });

        await overmindAuth.actions.auth.persistCookieAuth({
          user: user,
          expiry: new Date(),
        });
      });
    });

    describe('clearCookieAuth', () => {
      test('should invoke effects clear cookieAuth', async () => {
        const overmindAuth = createOvermindMock(config, {
          auth: {
            cookieAuth: {
              set: () => Promise.resolve(),
              clear: () => Promise.resolve(),
            },
          },
        });

        await overmindAuth.actions.auth.clearCookieAuth();
      });
    });
  });

  // == calling API == //

  // describe('API Actions', () => {});
});
