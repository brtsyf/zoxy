import { create } from './main';
import { ActionFunction } from './type';

class Hooks<T> {
  constructor() {}
  public isAsync(fn: ActionFunction<T>) {
    return fn.constructor.name === 'AsyncFunction';
  }
}

class History<T, K extends Record<string, ActionFunction<T>>> {
  constructor(private store: create<T, K>) {
    this.store = store;
  }
}

export { History, Hooks };
