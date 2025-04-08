"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrement = exports.increment = exports.store = void 0;
const main_1 = require("./main");
exports.store = new main_1.create({ count: 0, name: 'Ahmet' }, {
    increment: async (state, payload, payload2, payload3) => {
        await new Promise((resolve) => {
            setTimeout(() => {
                state.count += payload + payload2 + payload3;
                console.log('Output Async Action', state.count);
                resolve(true);
            }, 4000);
        });
    },
    decrement: (state) => {
        state.count -= 1;
    },
});
exports.store.actions.increment(1000, 2000, 5000);
_a = exports.store.actions, exports.increment = _a.increment, exports.decrement = _a.decrement;
