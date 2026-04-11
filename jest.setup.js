// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_AUTH_BASE_URL = 'http://localhost:3001/api'

// Mock axios for API calls
jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
    create: jest.fn(() => mockAxios),
    defaults: {
      headers: {
        common: {},
        post: {},
        put: {},
        patch: {}
      }
    },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }

  return {
    default: mockAxios,
    ...mockAxios
  }
})

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  }))
})

// Mock Monaco Editor
jest.mock('@monaco-editor/react', () => {
  return {
    __esModule: true,
    default: jest.fn(({ defaultValue, onChange }) => {
      return (
        <textarea
          data-testid="monaco-editor"
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )
    }),
    Editor: jest.fn(({ defaultValue, onChange }) => {
      return (
        <textarea
          data-testid="monaco-editor"
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )
    }),
  }
})

// Mock react-markdown
jest.mock('react-markdown', () => {
  return {
    __esModule: true,
    default: jest.fn(({ children }) => <div data-testid="markdown">{children}</div>),
  }
})

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
    span: jest.fn(({ children, ...props }) => <span {...props}>{children}</span>),
    button: jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
    form: jest.fn(({ children, ...props }) => <form {...props}>{children}</form>),
    input: jest.fn(({ ...props }) => <input {...props} />),
  },
  AnimatePresence: jest.fn(({ children }) => <>{children}</>),
  useAnimation: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  })),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Suppress console errors during tests unless explicitly needed
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported')) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})