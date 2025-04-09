import { ActionFunction, WrappedActionsTypePromise } from './type';
export type Middleware<T, K extends Record<string, ActionFunction<T>>> = (store: any, next: (action: WrappedActionsTypePromise<K>) => Promise<void>, action: WrappedActionsTypePromise<K>) => void | Promise<void>;
declare class MiddlewareManager<T, K extends Record<string, ActionFunction<T>>> {
    private middlewares;
    constructor(middlewares?: Middleware<T, K>[]);
    applyMiddleware(store: any, action: WrappedActionsTypePromise<K>): Promise<void>;
    addMiddleware(middleware: Middleware<T, K>): void;
}
export default MiddlewareManager;
