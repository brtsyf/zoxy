"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = exports.create = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const middleware_1 = __importDefault(require("./middleware"));
const hooks_1 = require("./hooks");
class createZoxy {
    constructor(initialState, actions, middlewares) {
        this.state = initialState;
        this.subscribers = new Set();
        this.actions = this.createActions(actions);
        this.middlewareManager = new middleware_1.default(middlewares);
        this.hooks = new hooks_1.Hooks();
        this.historyManager = new hooks_1.History(this);
    }
    createActions(actions) {
        const wrappedActions = {};
        Object.entries(actions).forEach(([name, fn]) => {
            wrappedActions[name] = async (...params) => {
                const action = { type: name, fn, params };
                await this.middlewareManager.applyMiddleware(this, action);
                if (this.hooks.isAsync(fn)) {
                    const promise = (async () => {
                        await fn(this.state, ...params);
                        this.setState(this.state);
                        this.historyManager.saveState();
                        return this.state;
                    })();
                    return promise;
                }
                const newState = (0, immer_1.produce)(this.state, (draft) => {
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
}
exports.create = createZoxy;
const useZoxy = (store) => {
    return (0, react_1.useSyncExternalStore)(store.subscribe.bind(store), store.getState.bind(store));
};
exports.useStore = useZoxy;
