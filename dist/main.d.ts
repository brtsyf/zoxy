import { ActionFunction, WrappedActionsType } from './type';
import { Middleware } from './middleware';
import { History } from './hooks';
declare class createZoxy<T, K extends Record<string, ActionFunction<T>>> {
    private subscribers;
    private state;
    historyManager: History<T, K>;
    private hooks;
    actions: WrappedActionsType<K>;
    private middlewareManager;
    constructor(initialState: T, actions: K, middlewares?: Middleware<T, K>[]);
    private createActions;
    private notifySubscribers;
    subscribe(callback: (state: T) => void): () => void;
    private unsubscribe;
    setState(newState: T): void;
    getState(): T;
}
declare const useZoxy: <T>(store: createZoxy<T, any>) => T;
export { createZoxy as create, useZoxy as useStore };
