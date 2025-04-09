// src/main.ts
import { produce } from "immer";
import { useSyncExternalStore } from "react";

// src/middleware.ts
var MiddlewareManager = class {
  constructor(middlewares = []) {
    this.middlewares = [];
    this.middlewares = middlewares;
  }
  async applyMiddleware(store, action) {
    let nextCalled = false;
    const next = async () => {
      nextCalled = true;
    };
    for (const middleware of this.middlewares) {
      const result = middleware(store, next, action);
      if (result instanceof Promise) {
        await result;
      }
      if (nextCalled) {
        return;
      }
    }
  }
  addMiddleware(middleware) {
    this.middlewares.push(middleware);
  }
};
var middleware_default = MiddlewareManager;

// src/hooks.ts
var Hooks = class {
  constructor() {
  }
  isAsync(fn) {
    return fn.constructor.name === "AsyncFunction";
  }
};
var History = class {
  constructor(store) {
    this.store = store;
    this.history = [];
    this.future = [];
    this.store = store;
  }
  saveState() {
    this.history.push({ ...this.store.getState() });
    this.future = [];
  }
  async undo() {
    if (this.history.length > 0) {
      const lastAction = this.history.pop();
      if (lastAction) {
        this.future.push(lastAction);
        this.store.setState(lastAction);
      }
    }
  }
  async redo() {
    if (this.future.length > 0) {
      const lastAction = this.future.pop();
      if (lastAction) {
        this.history.push(lastAction);
        this.store.setState(lastAction);
      }
    }
  }
};

// src/main.ts
var createZoxy = class {
  constructor(initialState, actions, middlewares) {
    this.state = initialState;
    this.subscribers = /* @__PURE__ */ new Set();
    this.actions = this.createActions(actions);
    this.middlewareManager = new middleware_default(middlewares);
    this.hooks = new Hooks();
    this.historyManager = new History(this);
  }
  createActions(actions) {
    const wrappedActions = {};
    Object.entries(actions).forEach(([name, fn]) => {
      wrappedActions[name] = async (...params) => {
        const action = { type: name, fn, params };
        await this.middlewareManager.applyMiddleware(
          this,
          action
        );
        if (this.hooks.isAsync(fn)) {
          const promise = (async () => {
            await fn(this.state, ...params);
            this.setState(this.state);
            this.historyManager.saveState();
            return this.state;
          })();
          return promise;
        }
        const newState = produce(this.state, (draft) => {
          fn(draft, ...params);
        });
        this.setState(newState);
        this.historyManager.saveState();
      };
    });
    return wrappedActions;
  }
  notifySubscribers() {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }
  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.state);
    return () => this.unsubscribe(callback);
  }
  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }
  setState(newState) {
    this.state = newState;
    this.notifySubscribers();
  }
  getState() {
    return this.state;
  }
};
var useZoxy = (store) => {
  return useSyncExternalStore(
    store.subscribe.bind(store),
    store.getState.bind(store),
    store.getState.bind(store)
  );
};
export {
  createZoxy as create,
  middleware_default as middleware,
  useZoxy as useStore
};
//# sourceMappingURL=index.mjs.map