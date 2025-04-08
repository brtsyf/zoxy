# Zoxy

A React-based application built with TypeScript.
TypeScript ile geliştirilmiş React tabanlı bir uygulama.

## 🚀 Features | Özellikler

- React 19 with TypeScript
- Jest for testing
- Prettier for code formatting
- Immer for immutable state management

- React 19 ve TypeScript
- Test için Jest
- Kod formatlama için Prettier
- Değişmez durum yönetimi için Immer

## 📋 Prerequisites | Gereksinimler

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

- Node.js (En son LTS sürümü önerilir)
- npm veya yarn paket yöneticisi

## 🛠️ Installation | Kurulum

1. Clone the repository:
   Depoyu klonlayın:

```bash
git clone [your-repository-url]
cd zoxy
```

2. Install dependencies:
   Bağımlılıkları yükleyin:

```bash
npm install
# or
yarn install
```

## 🚀 Usage | Kullanım

### Development | Geliştirme

To start the development server:
Geliştirme sunucusunu başlatmak için:

```bash
npm start
# or
yarn start
```

### Building | Derleme

To build the project:
Projeyi derlemek için:

```bash
npm run build
# or
yarn build
```

### Testing | Test

To run tests:
Testleri çalıştırmak için:

```bash
npm test
# or
yarn test
```

## 📚 Detailed Usage | Detaylı Kullanım

### State Management | Durum Yönetimi

The library provides a simple state management solution with middleware support. Here's how to use it:

Kütüphane, middleware desteği ile basit bir durum yönetimi çözümü sunar. İşte nasıl kullanılacağı:

```typescript
// Import the necessary types and functions
// Gerekli tipleri ve fonksiyonları içe aktarın
import { create } from 'zoxy';
import { Middleware } from 'zoxy/middleware';

// Define your state type
// Durum tipinizi tanımlayın
type State = {
  counter: number;
  user: {
    name: string;
    age: number;
  };
};

// Define your actions
// Aksiyonlarınızı tanımlayın
type Actions = {
  increment: (state: State, amount: number) => void;
  decrement: (state: State) => void;
  updateUser: (state: State, name: string, age: number) => void;
  getHistory: (state: State) => void;
};

// Create a middleware for logging
// Loglama için middleware oluşturun
const loggerMiddleware: Middleware<State, Actions> = async (
  store,
  next,
  action
) => {
  console.log('Action Started');
  const start = Date.now();
  await next(action);
  console.log('Action completed in:', Date.now() - start, 'ms');
};

// Create your store
// Store'unuzu oluşturun
export const store = new create<State, Actions>(
  // Initial state
  // Başlangıç durumu
  {
    counter: 0,
    user: {
      name: 'John',
      age: 25,
    },
  },
  // Actions
  // Aksiyonlar
  {
    increment: (state, amount) => {
      state.counter += amount;
    },
    decrement: (state) => {
      state.counter -= 1;
    },
    updateUser: (state, name, age) => {
      state.user.name = name;
      state.user.age = age;
    },
    getHistory: (state) => {
      console.log('State history:', store.historyManager.history);
    },
  },
  // Middlewares
  // Middleware'ler
  [loggerMiddleware]
);

// Usage examples
// Kullanım örnekleri

// Increment counter by 5
// Sayaç değerini 5 artır
store.actions.increment(5);

// Decrement counter
// Sayaç değerini azalt
store.actions.decrement();

// Update user information
// Kullanıcı bilgilerini güncelle
store.actions.updateUser('Ahmet', 30);

// Check state history
// Durum geçmişini kontrol et
store.actions.getHistory();

// Export actions for use in components
// Bileşenlerde kullanmak için aksiyonları dışa aktar
export const { increment, decrement, updateUser } = store.actions;
```

### Key Features | Temel Özellikler

1. **Type Safety | Tip Güvenliği**

   - Full TypeScript support with strict type checking
   - Katı tip kontrolü ile tam TypeScript desteği

2. **Middleware Support | Middleware Desteği**

   - Add custom middleware for:
     - Logging
     - Async operations
     - Error handling
     - Performance monitoring
   - Özel middleware ekleyin:
     - Loglama
     - Asenkron işlemler
     - Hata yönetimi
     - Performans izleme

3. **History Management | Geçmiş Yönetimi**

   - Track and inspect state changes
   - Debug state transitions
   - Implement undo/redo functionality
   - Durum değişikliklerini takip edin ve inceleyin
   - Durum geçişlerini hata ayıklayın
   - Geri alma/tekrar yapma işlevselliğini uygulayın

4. **Immutable State Updates | Değişmez Durum Güncellemeleri**
   - Safe state mutations
   - Predictable state changes
   - Easy debugging
   - Güvenli durum değişiklikleri
   - Öngörülebilir durum değişiklikleri
   - Kolay hata ayıklama

## 📁 Project Structure | Proje Yapısı

```
src/
├── dist/          # Compiled output | Derlenmiş çıktı
├── test/          # Test files | Test dosyaları
├── hooks.ts       # Custom React hooks | Özel React hook'ları
├── index.ts       # Entry point | Giriş noktası
├── main.ts        # Main application logic | Ana uygulama mantığı
├── middleware.ts  # Middleware functions | Middleware fonksiyonları
└── type.d.ts      # TypeScript type definitions | TypeScript tip tanımlamaları
```

## 🧪 Testing | Test

The project uses Jest and React Testing Library for testing. Tests can be found in the `src/test` directory.
Proje, test için Jest ve React Testing Library kullanmaktadır. Testler `src/test` dizininde bulunabilir.

## 🔧 Configuration | Yapılandırma

- `tsconfig.json` - TypeScript configuration | TypeScript yapılandırması
- `jest.config.js` - Jest testing configuration | Jest test yapılandırması
- `.prettierrc` - Prettier code formatting rules | Prettier kod formatlama kuralları

## 📦 Dependencies | Bağımlılıklar

### Main Dependencies | Ana Bağımlılıklar

- React 19
- TypeScript
- Immer

### Dev Dependencies | Geliştirme Bağımlılıkları

- Jest
- Prettier
- Testing Library

## 📝 License | Lisans

ISC License
ISC Lisansı

## 🤝 Contributing | Katkıda Bulunma

1. Fork the repository | Depoyu çatallayın
2. Create your feature branch (`git checkout -b feature/AmazingFeature`) | Özellik dalınızı oluşturun
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`) | Değişikliklerinizi kaydedin
4. Push to the branch (`git push origin feature/AmazingFeature`) | Dalı gönderin
5. Open a Pull Request | Bir Pull Request açın
