import { produce } from 'immer';
import { useSyncExternalStore } from 'react';
import {
  ActionFunction,
  OmitFirstParameter,
  WrappedActionsType,
  WrappedActionsTypePromise,
} from './type';
import MiddlewareManager, { Middleware } from './middleware';
import { History, Hooks } from './hooks';
class createZoxy<T, K extends Record<string, ActionFunction<T>>> {
  private subscribers: Set<(state: T) => void>;
  private state: T;
  public historyManager: History<T, K>;
  private hooks: Hooks<T>;
  public actions: WrappedActionsType<K>;
  private middlewareManager: MiddlewareManager<T, K>;
  constructor(initialState: T, actions: K, middlewares?: Middleware<T, K>[]) {
    this.state = initialState;
    this.subscribers = new Set();
    this.actions = this.createActions(actions);
    this.middlewareManager = new MiddlewareManager<T, K>(middlewares);
    this.hooks = new Hooks<T>();
    this.historyManager = new History<T, K>(this);
  }

  private createActions(actions: K) {
    const wrappedActions = {} as WrappedActionsType<K>;
    Object.entries(actions).forEach(([name, fn]) => {
      wrappedActions[name as keyof K] = async (
        ...params: OmitFirstParameter<K[keyof K]>
      ) => {
        const action = { type: name, fn, params };
        await this.middlewareManager.applyMiddleware(
          this,
          action as WrappedActionsTypePromise<K>
        );
        if (this.hooks.isAsync(fn)) {
          const promise = (async () => {
            await (fn as any)(this.state, ...params);
            this.setState(this.state);
            this.historyManager.saveState();
            return this.state;
          })();
          return promise;
        }

        const newState = produce(this.state, (draft: T) => {
          fn(draft, ...params);
        });
        this.setState(newState);
        this.historyManager.saveState();
      };
    });
    return wrappedActions;
  }

  private notifySubscribers() {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }

  public subscribe(callback: (state: T) => void) {
    this.subscribers.add(callback);
    callback(this.state);
    return () => this.unsubscribe(callback);
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
    store.getState.bind(store),
    store.getState.bind(store)
  );
};

export { createZoxy as create, useZoxy as useStore };
