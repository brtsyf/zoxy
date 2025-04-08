"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MiddlewareManager {
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
}
exports.default = MiddlewareManager;
