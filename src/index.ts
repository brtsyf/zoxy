import { create } from './main';

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
          console.log('Output Async Action', state.count);
          resolve(true);
        }, 4000);
      });
    },
    decrement: (state: State) => {
      state.count -= 1;
    },
  }
);

store.actions.increment(1000, 2000, 5000);

export const { increment, decrement } = store.actions;
