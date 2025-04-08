// src/Counter.tsx
import React from 'react';
import { decrement, increment, store } from '../..';
import { useStore } from '../../main';

const Counter = () => {
  const { count } = useStore(store);

  return (
    <div>
      <button onClick={() => increment(1000, 2000, 3000)}>Increment</button>
      <button onClick={() => decrement()}>Decrement</button>
      <p>Count: {count}</p>
    </div>
  );
};

export default Counter;
