import { create } from './main';
import { ActionFunction } from './type';

class Hooks<T> {
  constructor() {}
  public isAsync(fn: ActionFunction<T>) {
    return fn.constructor.name === 'AsyncFunction';
  }
}

class History<T, K extends Record<string, ActionFunction<T>>> {
  history: T[] = [];
  future: T[] = [];
  constructor(private store: create<T, K>) {
    this.store = store;
  }

  public saveState() {
    this.history.push({ ...this.store.getState() });
    this.future = [];
  }

  public async undo() {
    if (this.history.length > 0) {
      const lastAction = this.history.pop();
      if (lastAction) {
        this.future.push(lastAction);
        this.store.setState(lastAction);
      }
    }
  }

  public async redo() {
    if (this.future.length > 0) {
      const lastAction = this.future.pop();
      if (lastAction) {
        this.history.push(lastAction);
        this.store.setState(lastAction);
      }
    }
  }
}

export { History, Hooks };
