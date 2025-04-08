import { produce } from 'immer';
import { useSyncExternalStore } from 'react';
import { ActionFunction, OmitFirstParameter, WrappedActionsType } from './type';
class createZoxy<T, K extends Record<string, ActionFunction<T>>> {
  private subscribers: Set<(state: T) => void>;
  private state: T;
  public actions: WrappedActionsType<K>;

  constructor(initialState: T, actions: K) {
    this.state = initialState;
    this.subscribers = new Set();
    this.actions = this.createActions(actions);
  }

  private createActions(actions: K) {
    const wrappedActions = {} as WrappedActionsType<K>;
    Object.entries(actions).forEach(([name, fn]) => {
      wrappedActions[name as keyof K] = (
        ...params: OmitFirstParameter<K[keyof K]>
      ) => {
        if (this.isAsync(fn)) {
          // For async actions, we need to handle the Promise
          const promise = (async () => {
            await (fn as any)(this.state, ...params);
            this.setState(this.state);
            return this.state;
          })();
          return promise;
        }
        // Handle sync actions
        const newState = produce(this.state, (draft: T) => {
          fn(draft, ...params);
        });
        this.setState(newState);
      };
    });
    return wrappedActions;
  }

  private notifySubscribers() {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }

  public subscribe(callback: (state: T) => void) {
    this.subscribers.add(callback);
    callback(this.state); // İlk abone olduğunda state'i hemen ver
    return () => this.unsubscribe(callback);
  }

  private isAsync(fn: ActionFunction<T>) {
    return fn.constructor.name === 'AsyncFunction';
  }

  private unsubscribe(callback: (state: T) => void) {
    this.subscribers.delete(callback);
  }

  public setState(newState: T) {
    this.state = newState;
    this.notifySubscribers();
  }

  public getState(): T {
    return this.state;
  }
}

const useZoxy = <T>(store: createZoxy<T, any>) => {
  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getState.bind(store)
  );
};

export { createZoxy as create, useZoxy as useStore };
