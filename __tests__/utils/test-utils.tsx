import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock contexts and providers
const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
  isAuthenticated: false,
}

const mockProblemAdminAuthContext = {
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
}

// Test providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  )
}

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const user = userEvent.setup()

  return {
    user,
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  }
}

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'USER',
  bio: 'Test bio',
  avatar_url: null,
  github_url: null,
  linkedin_url: null,
  website_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockProblem = (overrides = {}) => ({
  id: 1,
  title: 'Test Problem',
  description: 'A test problem description',
  difficulty: 'EASY',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  testCases: [
    {
      id: 1,
      input: '1 2',
      expectedOutput: '3',
      isPublic: true,
    },
  ],
  ...overrides,
})

export const createMockSubmission = (overrides = {}) => ({
  id: 1,
  userId: 1,
  problemId: 1,
  language: 'javascript',
  sourceCode: 'console.log("Hello World");',
  status: 'ACCEPTED',
  executionTime: 100,
  memoryUsage: 1024,
  score: 100,
  verdict: 'Accepted',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
})

export const mockApiError = (message = 'API Error', status = 500) => {
  const error = new Error(message) as any
  error.response = {
    data: { message },
    status,
    statusText: 'Internal Server Error',
  }
  return error
}

// Common test assertions
export const expectElementToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

export const expectElementToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveTextContent(text)
}

// Mock localStorage
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })

  return localStorageMock
}

// Mock fetch
export const mockFetch = (response: any, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      status: ok ? 200 : 500,
      statusText: ok ? 'OK' : 'Internal Server Error',
    })
  ) as jest.Mock
}

// Screen size testing utilities
export const mockViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })

  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

// Authentication test helpers
export const mockAuthentication = (isAuthenticated = true, user = createMockUser()) => {
  return {
    ...mockAuthContext,
    isAuthenticated,
    user: isAuthenticated ? user : null,
  }
}

// Cleanup helpers
export const cleanupMocks = () => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }