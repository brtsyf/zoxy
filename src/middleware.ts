import { create } from './main';
import { ActionFunction, WrappedActionsTypePromise } from './type';

export type Middleware<T, K extends Record<string, ActionFunction<T>>> = (
  store: create<T, K>,
  next: (action: WrappedActionsTypePromise<K>) => Promise<void>,
  action: WrappedActionsTypePromise<K>
) => void | Promise<void>;

class MiddlewareManager<T, K extends Record<string, ActionFunction<T>>> {
  private middlewares: Middleware<T, K>[] = [];
  constructor(middlewares: Middleware<T, K>[] = []) {
    this.middlewares = middlewares;
  }

  public async applyMiddleware(
    store: create<T, any>,
    action: WrappedActionsTypePromise<K>
  ) {
    let nextCalled = false;
    const next = async () => {
      nextCalled = true;
    };
    for (const middleware of this.middlewares) {
      const result = middleware(store, next, action);
      // Eğer async bir işlem varsa bekle
      if (result instanceof Promise) {
        await result;
      }
      // next çağrıldıysa, diğer middleware'lara geçme
      if (nextCalled) {
        return;
      }
    }
  }

  public addMiddleware(middleware: Middleware<T, K>) {
    this.middlewares.push(middleware);
  }
}

export default MiddlewareManager;
