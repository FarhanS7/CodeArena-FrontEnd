import React from 'react'
import { act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../features/auth/AuthProvider'
import { render, createMockUser, mockApiResponse, mockApiError, cleanupMocks } from '../utils/test-utils'
import * as loginApi from '../../features/auth/api/login'
import * as signupApi from '../../features/auth/api/signup'
import * as logoutApi from '../../features/auth/api/logout'
import * as meApi from '../../features/auth/api/me'
import * as refreshApi from '../../features/auth/api/refresh'

// Mock the API modules
jest.mock('../../features/auth/api/login')
jest.mock('../../features/auth/api/signup')
jest.mock('../../features/auth/api/logout')
jest.mock('../../features/auth/api/me')
jest.mock('../../features/auth/api/refresh')

// Mock toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isLoading, isAuthenticated, login, signup, logout, reloadUser } = useAuth()

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'loaded'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="username">{user?.username || 'no-user'}</div>

      <button
        data-testid="login-btn"
        onClick={() => login({ email: 'test@example.com', password: 'password' })}
      >
        Login
      </button>

      <button
        data-testid="signup-btn"
        onClick={() => signup({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password'
        })}
      >
        Signup
      </button>

      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>

      <button data-testid="reload-btn" onClick={reloadUser}>
        Reload
      </button>
    </div>
  )
}

describe('AuthProvider', () => {
  const mockUser = createMockUser()

  beforeEach(() => {
    cleanupMocks()
  })

  describe('Initial Loading State', () => {
    it('should show loading state initially', () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(getByTestId('loading')).toHaveTextContent('loading')
    })

    it('should load authenticated user on startup', async () => {
      ;(meApi.getMe as jest.Mock).mockResolvedValue(mockUser)

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('loaded')
        expect(getByTestId('authenticated')).toHaveTextContent('authenticated')
        expect(getByTestId('username')).toHaveTextContent(mockUser.username)
      })
    })

    it('should refresh token if initial getMe fails', async () => {
      ;(meApi.getMe as jest.Mock)
        .mockRejectedValueOnce(mockApiError('Unauthorized', 401))
        .mockResolvedValueOnce(mockUser)
      ;(refreshApi.refreshToken as jest.Mock).mockResolvedValue(undefined)

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(getByTestId('loaded')).toBeInTheDocument()
        expect(getByTestId('authenticated')).toHaveTextContent('authenticated')
        expect(refreshApi.refreshToken).toHaveBeenCalled()
      })
    })

    it('should set unauthenticated state if both getMe and refresh fail', async () => {
      ;(meApi.getMe as jest.Mock).mockRejectedValue(mockApiError('Unauthorized', 401))
      ;(refreshApi.refreshToken as jest.Mock).mockRejectedValue(mockApiError('Refresh failed', 401))

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('loaded')
        expect(getByTestId('authenticated')).toHaveTextContent('not-authenticated')
        expect(getByTestId('username')).toHaveTextContent('no-user')
      })
    })
  })

  describe('Login Flow', () => {
    it('should login successfully and redirect', async () => {
      ;(meApi.getMe as jest.Mock).mockRejectedValue(mockApiError('Not authenticated'))
      ;(refreshApi.refreshToken as jest.Mock).mockRejectedValue(mockApiError('No refresh token'))
      ;(loginApi.login as jest.Mock).mockResolvedValue(mockApiResponse({ message: 'Login successful' }))
      ;(meApi.getMe as jest.Mock).mockResolvedValueOnce(mockUser)

      const { getByTestId, user } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Wait for initial load
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('loaded')
      })

      // Trigger login
      await act(async () => {
        await user.click(getByTestId('login-btn'))
      })

      await waitFor(() => {
        expect(loginApi.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password',
        })
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('should handle login failure', async () => {
      ;(meApi.getMe as jest.Mock).mockRejectedValue(mockApiError('Not authenticated'))
      ;(refreshApi.refreshToken as jest.Mock).mockRejectedValue(mockApiError('No refresh token'))
      ;(loginApi.login as jest.Mock).mockRejectedValue(mockApiError('Invalid credentials', 401))

      const { getByTestId, user } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('loaded')
      })

      await act(async () => {
        await user.click(getByTestId('login-btn'))
      })

      await waitFor(() => {
        expect(getByTestId('authenticated')).toHaveTextContent('not-authenticated')
      })
    })
  })

  describe('Signup Flow', () => {
    it('should signup successfully and redirect', async () => {
      ;(meApi.getMe as jest.Mock).mockRejectedValue(mockApiError('Not authenticated'))
      ;(refreshApi.refreshToken as jest.Mock).mockRejectedValue(mockApiError('No refresh token'))
      ;(signupApi.signup as jest.Mock).mockResolvedValue(mockApiResponse({ message: 'Signup successful' }))
      ;(meApi.getMe as jest.Mock).mockResolvedValueOnce(mockUser)

      const { getByTestId, user } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('loaded')
      })

      await act(async () => {
        await user.click(getByTestId('signup-btn'))
      })

      await waitFor(() => {
        expect(signupApi.signup).toHaveBeenCalledWith({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
        })
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('Logout Flow', () => {
    it('should logout successfully and redirect', async () => {
      ;(meApi.getMe as jest.Mock).mockResolvedValue(mockUser)
      ;(logoutApi.logout as jest.Mock).mockResolvedValue(undefined)

      const { getByTestId, user } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(getByTestId('authenticated')).toHaveTextContent('authenticated')
      })

      await act(async () => {
        await user.click(getByTestId('logout-btn'))
      })

      await waitFor(() => {
        expect(logoutApi.logout).toHaveBeenCalled()
        expect(getByTestId('authenticated')).toHaveTextContent('not-authenticated')
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Reload User', () => {
    it('should reload user data successfully', async () => {
      const updatedUser = { ...mockUser, username: 'updateduser' }

      ;(meApi.getMe as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedUser)

      const { getByTestId, user } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      await waitFor(() => {
        expect(getByTestId('username')).toHaveTextContent(mockUser.username)
      })

      await act(async () => {
        await user.click(getByTestId('reload-btn'))
      })

      await waitFor(() => {
        expect(getByTestId('username')).toHaveTextContent(updatedUser.username)
      })
    })
  })

  describe('Error Handling', () => {
    it('should throw error when useAuth is used outside AuthProvider', () => {
      const originalError = console.error
      console.error = jest.fn()

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth must be used within an AuthProvider')

      console.error = originalError
    })
  })
})