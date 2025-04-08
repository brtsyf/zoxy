import { ActionFunction, WrappedActionsType } from './type';

class Middleware<K extends Record<string, ActionFunction<K>>> {
  constructor(private store: WrappedActionsType<K>) {
    this.store = store;
  }
  public use(middleware: Middleware<K>) {
    // this.store.use(middleware);
  }
}

export default Middleware;
