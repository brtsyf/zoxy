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
  checkHistory: (state: State) => void;
};

const loggerMiddleware: Middleware<State, Actions> = async (
  store,
  next,
  action
) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
  next(action);
};

export const store = new create<State, Actions>(
  { count: 0, name: 'Ahmet' },
  {
    increment: (
      state: State,
      payload: number,
      payload2: number,
      payload3: number
    ) => {
      state.count += payload + payload2 + payload3;
      console.log('Output ', state.count);
    },
    checkHistory: (state: State) => {
      console.log(store.historyManager.history);
    },
    decrement: (state: State) => {
      state.count -= 1;
    },
  },
  [loggerMiddleware]
);

store.actions.increment(1000, 2000, 5000);
store.actions.increment(1000, 2000, 5000);
store.actions.checkHistory();

export const { increment, decrement } = store.actions;
