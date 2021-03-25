import { namespaced } from 'overmind/config';
import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from 'overmind-react';
import auth from './auth';
import resources from './auth';
import { IConfig } from 'overmind';

declare module 'overmind' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Config
    extends IConfig<{
      state: typeof config.state;
      actions: typeof config.actions;
      effects: typeof config.effects;
    }> {}
  // Due to circular typing we have to define an
  // explicit typing of state, actions and effects since
  // TS 3.9
}

export const config = namespaced({ auth, resources });

export const useStore = createStateHook();
export const useActions = createActionsHook();
export const useEffects = createEffectsHook();
export const useReaction = createReactionHook();
