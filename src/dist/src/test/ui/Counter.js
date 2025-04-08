"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/Counter.tsx
const react_1 = __importDefault(require("react"));
const __1 = require("../..");
const main_1 = require("../../main");
const Counter = () => {
    const { count } = (0, main_1.useStore)(__1.store);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { onClick: () => (0, __1.increment)(1000, 2000) }, "Increment"),
        react_1.default.createElement("button", { onClick: () => (0, __1.decrement)() }, "Decrement"),
        react_1.default.createElement("p", null,
            "Count: ",
            count)));
};
exports.default = Counter;
