# Zoxy

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat&colorA=000000&colorB=000000)](https://github.com/brtsyf/zoxy)
[![Bundle Size](https://img.shields.io/badge/bundle%20size-small-blue?style=flat&colorA=000000&colorB=000000)](https://github.com/brtsyf/zoxy)
[![Version](https://img.shields.io/badge/version-1.0.3-blue?style=flat&colorA=000000&colorB=000000)](https://github.com/brtsyf/zoxy)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue?style=flat&colorA=000000&colorB=000000)](https://www.typescriptlang.org/)

A lightweight, type-safe state management library built with React and TypeScript. Simple but powerful, with no boilerplate.

## 🌟 Highlights

- **Simple API** - Based on hooks, easy to learn and use
- **TypeScript First** - Full type safety with minimal setup
- **Middleware Support** - Logging, persistence, and more
- **Immutable Updates** - Safe state mutations with Immer
- **Minimal Re-renders** - Components update only when needed
- **Zero Dependencies** - Tiny footprint, no extra baggage

## 📦 Installation

```bash
npm install @seyfoo/zoxy
# or
yarn add @seyfoo/zoxy
```

## 🚀 Quick Start

### Create a store

```tsx
import { create, useStore } from 'zoxy';

// Define your state type
type CountState = {
  count: number;
};

// Define your actions
const countActions = {
  increment: (state: CountState) => {
    state.count += 1;
  },
  decrement: (state: CountState) => {
    state.count -= 1;
  },
  reset: (state: CountState) => {
    state.count = 0;
  },
};

// Create your store
export const countStore = new create<CountState, typeof countActions>(
  // Initial state
  { count: 0 },
  // Actions
  countActions
);
```

### Use it in a component

```tsx
function Counter() {
  // Get the current state using the useStore hook
  const state = useStore(countStore);

  return (
    <div>
      <h1>{state.count}</h1>
      <button onClick={() => countStore.actions.increment()}>+1</button>
      <button onClick={() => countStore.actions.decrement()}>-1</button>
      <button onClick={() => countStore.actions.reset()}>Reset</button>
    </div>
  );
}
```

No providers needed! Just create stores and use them anywhere in your app.

## 🧩 Advanced Usage

### Async Actions

```tsx
import { create, useStore } from 'zoxy';

type UserState = {
  user: any;
  loading: boolean;
  error: any;
};

const userActions = {
  setLoading: (state: UserState, isLoading: boolean) => {
    state.loading = isLoading;
  },
  setError: (state: UserState, error: any) => {
    state.error = error;
  },
  setUser: (state: UserState, user: any) => {
    state.user = user;
  },
  fetchUser: async (state: UserState, id: string) => {
    userStore.actions.setLoading(true);
    userStore.actions.setError(null);
    try {
      const response = await fetch(`https://api.example.com/users/${id}`);
      const user = await response.json();
      userStore.actions.setUser(user);
    } catch (error) {
      userStore.actions.setError(error);
    } finally {
      userStore.actions.setLoading(false);
    }
  },
};

export const userStore = new create<UserState, typeof userActions>(
  // Initial state
  {
    user: null,
    loading: false,
    error: null,
  },
  // Actions
  userActions
);
```

### Using Middleware

```tsx
import { create, useStore } from 'zoxy';
import { Middleware } from 'zoxy/middleware';

// Define a logger middleware
const loggerMiddleware: Middleware<
  SettingsState,
  typeof settingsActions
> = async (store, next, action) => {
  console.log(`Action Started: ${action.type}`, action.params);
  const start = Date.now();
  await next(action);
  console.log(`Action completed: ${action.type} in ${Date.now() - start}ms`);
};

// Define a persistence middleware
const persistMiddleware: Middleware<
  SettingsState,
  typeof settingsActions
> = async (store, next, action) => {
  await next(action);
  // Save to localStorage after every action
  localStorage.setItem('settings-storage', JSON.stringify(store.getState()));
};

type SettingsState = {
  theme: string;
  language: string;
};

const settingsActions = {
  setTheme: (state: SettingsState, theme: string) => {
    state.theme = theme;
  },
  setLanguage: (state: SettingsState, language: string) => {
    state.language = language;
  },
};

export const settingsStore = new create<SettingsState, typeof settingsActions>(
  // Initial state
  {
    theme: 'light',
    language: 'en',
  },
  // Actions
  settingsActions,
  // Middlewares
  [loggerMiddleware, persistMiddleware]
);
```

## 🔍 State Management Details

### Store with TypeScript

```typescript
import { create, useStore } from 'zoxy';
import { Middleware } from 'zoxy/middleware';

type State = {
  counter: number;
  user: {
    name: string;
    age: number;
  };
};

const actions = {
  increment: (state: State, amount: number) => {
    stat.counter += amount;
  },
  decrement: (state: State) => {
    state.counter -= 1;
  },
  updateUser: (state: State, name: string, age: number) => {
    state.user.name = name;
    state.user.age = age;
  },
  fetchUserData: async (state: State, userId: string) => {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    const userData = await response.json();
    state.user.name = userData.name;
    state.user.age = userData.age;
  },
};

// Create a logger middleware
const loggerMiddleware: Middleware<State, typeof actions> = async (
  store,
  next,
  action
) => {
  console.log(`Action Started: ${action.type}`, action.params);
  const start = Date.now();
  await next(action);
  console.log(`Action completed: ${action.type} in ${Date.now() - start}ms`);
};

// Create your store
export const store = new create<State, typeof actions>(
  // Initial state
  {
    counter: 0,
    user: {
      name: 'John',
      age: 25,
    },
  },
  // Actions
  actions,
  // Middlewares
  [loggerMiddleware]
);

// Usage examples
// Increment counter by 5
store.actions.increment(5);
// Decrement counter
store.actions.decrement();
// Update user information
store.actions.updateUser('John', 30);
// Use async action
store.actions.fetchUserData('user123').then(() => {
  console.log('User data fetched', store.getState().user);
});
```

### Middleware for Logging

```typescript
import { Middleware } from 'zoxy/middleware';

// Create a middleware for logging
const loggerMiddleware: Middleware<State, typeof actions> = async (
  store,
  next,
  action
) => {
  console.log(`Action Started: ${action.type}`, action.params);
  const start = Date.now();
  await next(action);
  console.log(`Action completed: ${action.type} in ${Date.now() - start}ms`);
};
```

### History Management

```typescript
import { create, useStore } from 'zoxy';

type State = {
  counter: number;
  text: string;
};

const actions = {
  increment: (state: State) => {
    state.counter += 1;
  },
  setText: (state: State, text: string) => {
    state.text = text;
  },
};

export const store = new create<State, typeof actions>(
  { counter: 0, text: '' },
  actions
);

// Usage examples
store.actions.increment(); // counter = 1
store.actions.setText('Hello'); // text = 'Hello'

// History management (undo/redo)
store.historyManager.undo(); // Revert to the previous state
store.historyManager.redo(); // Redo the undone action

// You can inspect the current state
console.log(store.getState()); // After undo, counter = 0, text = ''
```

You can also use the history manager in React components:

```tsx
function HistoryControls() {
  const state = useStore(store);

  return (
    <div>
      <p>Counter: {state.counter}</p>
      <p>Text: {state.text}</p>
      <button onClick={() => store.historyManager.undo()}>Undo</button>
      <button onClick={() => store.historyManager.redo()}>Redo</button>
    </div>
  );
}
```

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/brtsyf/zoxy.git
cd zoxy

# Install dependencies
npm install
# or
yarn install

# Start development server
npm start
# or
yarn start

# Build for production
npm run build
# or
yarn build
```

## 📁 Project Structure

```
src/
├── dist/          # Compiled output
├── hooks.ts       # Custom React hooks
├── index.ts       # Entry point
├── main.ts        # Main application logic
├── middleware.ts  # Middleware functions
└── type.d.ts      # TypeScript type definitions
```

## 🤔 Why Zoxy?

### Why Zoxy over Redux?

- **Simple and un-opinionated** - No boilerplate, no complex setup
- **Hooks as primary API** - Makes state consumption natural in React
- **No providers needed** - Use stores directly anywhere
- **Predictable updates** - State is always immutable

### Why Zoxy over Context?

- **Less boilerplate** - Create stores without wrapping providers
- **Performance** - Updates only what's needed, not entire trees
- **Centralized actions** - Keep business logic in one place
- **Middleware support** - Add custom behaviors easily

## 📝 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
