/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './ui/Counter';
import { store, increment, decrement } from '../index';
import * as main from '../main';

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
  render(<Counter />);

  // Başlangıçta count 0 olmalı
  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  // Increment butonuna tıklayın
  fireEvent.click(screen.getByText(/increment/i));
  expect(screen.getByText('Count: 0')).toBeInTheDocument(); // State mock edildiği için değişmeyecek
  expect(increment).toHaveBeenCalledWith(1000, 2000, 3000);

  // Decrement butonuna tıklayın
  fireEvent.click(screen.getByText(/decrement/i));
  expect(screen.getByText('Count: 0')).toBeInTheDocument(); // State mock edildiği için değişmeyecek
  expect(decrement).toHaveBeenCalled();
});
