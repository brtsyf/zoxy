import { create } from './main';
import { Middleware } from './middleware';

type State = {
  count: number;
  name: string;
};

type Actions = {
  increment: (
    state: State,
    payload: number,
    payload2: number,
    payload3: number
  ) => void;
  decrement: (state: State) => void;
};

const loggerMiddleware: Middleware<State, Actions> = async (
  store,
  next,
  action
) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('Middleware 1');
      resolve(true);
    }, 4000);
  });
};
const loggerMiddleware2: Middleware<State, Actions> = async (
  store,
  next,
  action
) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log('Middleware 1');
      resolve(true);
    }, 4000);
  });
  next(action);
};

export const store = new create<State, Actions>(
  { count: 0, name: 'Ahmet' },
  {
    increment: async (
      state: State,
      payload: number,
      payload2: number,
      payload3: number
    ) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          state.count += payload + payload2 + payload3;
          console.log('Output ', state.count);
          resolve(true);
        }, 4000);
      });
    },
    decrement: (state: State) => {
      state.count -= 1;
    },
  },
  [loggerMiddleware, loggerMiddleware2]
);

store.actions.increment(1000, 2000, 5000);

export const { increment, decrement } = store.actions;
