"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hooks = exports.History = void 0;
class Hooks {
    constructor() { }
    isAsync(fn) {
        return fn.constructor.name === 'AsyncFunction';
    }
}
exports.Hooks = Hooks;
class History {
    constructor(store) {
        this.store = store;
        this.history = [];
        this.future = [];
        this.store = store;
    }
    saveState() {
        this.history.push(Object.assign({}, this.store.getState()));
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
}
exports.History = History;
