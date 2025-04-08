"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  create: () => createZoxy,
  middleware: () => middleware_default,
  useStore: () => useZoxy
});
module.exports = __toCommonJS(index_exports);

// src/main.ts
var import_immer = require("immer");
var import_react = require("react");

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
        const newState = (0, import_immer.produce)(this.state, (draft) => {
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
  return (0, import_react.useSyncExternalStore)(
    store.subscribe.bind(store),
    store.getState.bind(store)
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create,
  middleware,
  useStore
});
//# sourceMappingURL=index.js.map