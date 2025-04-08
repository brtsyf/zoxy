"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="@testing-library/jest-dom" />
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
require("@testing-library/jest-dom");
const Counter_1 = __importDefault(require("./ui/Counter"));
const index_1 = require("../index");
// Mock the store and actions
jest.mock('../index', () => ({
    store: {
        getState: () => ({ count: 0 }),
        setState: jest.fn(),
        subscribe: jest.fn(),
    },
    increment: jest.fn(),
    decrement: jest.fn(),
}));
// Mock the useStore hook
jest.mock('../main', () => ({
    useStore: () => ({ count: 0 }),
}));
test('Counter increments and decrements', () => {
    (0, react_2.render)(react_1.default.createElement(Counter_1.default, null));
    // Başlangıçta count 0 olmalı
    expect(react_2.screen.getByText('Count: 0')).toBeInTheDocument();
    // Increment butonuna tıklayın
    react_2.fireEvent.click(react_2.screen.getByText(/increment/i));
    expect(react_2.screen.getByText('Count: 0')).toBeInTheDocument(); // State mock edildiği için değişmeyecek
    expect(index_1.increment).toHaveBeenCalledWith(1000, 2000);
    // Decrement butonuna tıklayın
    react_2.fireEvent.click(react_2.screen.getByText(/decrement/i));
    expect(react_2.screen.getByText('Count: 0')).toBeInTheDocument(); // State mock edildiği için değişmeyecek
    expect(index_1.decrement).toHaveBeenCalled();
});
