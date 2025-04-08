"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = exports.create = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
class createZoxy {
    constructor(initialState, actions) {
        this.state = initialState;
        this.subscribers = new Set();
        this.actions = this.createActions(actions);
    }
    createActions(actions) {
        const wrappedActions = {};
        Object.entries(actions).forEach(([name, fn]) => {
            wrappedActions[name] = (...params) => {
                if (this.isAsync(fn)) {
                    // For async actions, we need to handle the Promise
                    const promise = (async () => {
                        await fn(this.state, ...params);
                        this.setState(this.state);
                        return this.state;
                    })();
                    return promise;
                }
                // Handle sync actions
                const newState = (0, immer_1.produce)(this.state, (draft) => {
                    fn(draft, ...params);
                });
                this.setState(newState);
            };
        });
        return wrappedActions;
    }
    notifySubscribers() {
        this.subscribers.forEach((subscriber) => subscriber(this.state));
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        callback(this.state); // İlk abone olduğunda state'i hemen ver
        return () => this.unsubscribe(callback);
    }
    isAsync(fn) {
        return fn.constructor.name === 'AsyncFunction';
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
