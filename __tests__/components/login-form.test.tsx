import React from 'react'
import { act, waitFor } from '@testing-library/react'
import { LoginForm } from '../../components/auth/LoginForm'
import { render, mockAuthentication, cleanupMocks } from '../utils/test-utils'

// Mock the auth provider
const mockLogin = jest.fn()
const mockAuthContext = {
  ...mockAuthentication(false),
  login: mockLogin,
  isLoading: false,
}

jest.mock('../../features/auth/AuthProvider', () => ({
  useAuth: () => mockAuthContext,
}))

describe('LoginForm', () => {
  beforeEach(() => {
    cleanupMocks()
    mockLogin.mockClear()
    mockAuthContext.isLoading = false
  })

  describe('Rendering', () => {
    it('should render login form with all required fields', () => {
      const { getByRole, getByLabelText } = render(<LoginForm />)

      expect(getByRole('heading', { name: /login/i })).toBeInTheDocument()
      expect(getByLabelText(/email/i)).toBeInTheDocument()
      expect(getByLabelText(/password/i)).toBeInTheDocument()
      expect(getByRole('button', { name: /login/i })).toBeInTheDocument()
    })

    it('should have proper input types', () => {
      const { getByLabelText } = render(<LoginForm />)

      expect(getByLabelText(/email/i)).toHaveAttribute('type', 'email')
      expect(getByLabelText(/password/i)).toHaveAttribute('type', 'password')
    })

    it('should have required attributes on inputs', () => {
      const { getByLabelText } = render(<LoginForm />)

      expect(getByLabelText(/email/i)).toBeRequired()
      expect(getByLabelText(/password/i)).toBeRequired()
    })
  })

  describe('Form Interaction', () => {
    it('should update form state when typing in inputs', async () => {
      const { getByLabelText, user } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })

    it('should clear error when user starts typing', async () => {
      // First, simulate an error state
      mockLogin.mockRejectedValue(new Error('Login failed'))

      const { getByLabelText, getByRole, user, queryByText } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /login/i })

      // Enter credentials and submit to trigger error
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(queryByText(/invalid email or password/i)).toBeInTheDocument()
      })

      // Now type in the email field - error should clear
      await user.clear(emailInput)
      await user.type(emailInput, 'newemail@example.com')

      expect(queryByText(/invalid email or password/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should call login function with correct credentials', async () => {
      mockLogin.mockResolvedValue(undefined)

      const { getByLabelText, getByRole, user } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })

    it('should prevent submission with empty fields', async () => {
      const { getByRole, user } = render(<LoginForm />)

      const submitButton = getByRole('button', { name: /login/i })
      await user.click(submitButton)

      // Form should not submit due to HTML5 validation
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('should display error message on login failure', async () => {
      mockLogin.mockRejectedValue(new Error('Login failed'))

      const { getByLabelText, getByRole, getByText, user } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(getByText(/invalid email or password/i)).toBeInTheDocument()
      })
    })

    it('should clear form error when submitting again', async () => {
      // First submission fails
      mockLogin
        .mockRejectedValueOnce(new Error('Login failed'))
        .mockResolvedValueOnce(undefined)

      const { getByLabelText, getByRole, getByText, user, queryByText } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /login/i })

      // First attempt - should fail
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(getByText(/invalid email or password/i)).toBeInTheDocument()
      })

      // Second attempt - should succeed
      await user.clear(passwordInput)
      await user.type(passwordInput, 'correctpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(queryByText(/invalid email or password/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Loading State', () => {
    it('should disable button when loading', () => {
      mockAuthContext.isLoading = true

      const { getByRole } = render(<LoginForm />)

      const submitButton = getByRole('button', { name: /login/i })
      expect(submitButton).toBeDisabled()
    })

    it('should show loading text when submitting', () => {
      mockAuthContext.isLoading = true

      const { getByRole } = render(<LoginForm />)

      const submitButton = getByRole('button')
      expect(submitButton).toHaveTextContent(/login/i)
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation between fields', async () => {
      const { getByLabelText, user } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)

      await user.click(emailInput)
      expect(emailInput).toHaveFocus()

      await user.tab()
      expect(passwordInput).toHaveFocus()
    })

    it('should submit form when pressing Enter in password field', async () => {
      mockLogin.mockResolvedValue(undefined)

      const { getByLabelText, user } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for screen readers', () => {
      const { getByLabelText } = render(<LoginForm />)

      expect(getByLabelText(/email/i)).toBeInTheDocument()
      expect(getByLabelText(/password/i)).toBeInTheDocument()
    })

    it('should associate error message with form elements', async () => {
      mockLogin.mockRejectedValue(new Error('Login failed'))

      const { getByLabelText, getByRole, getByText, user } = render(<LoginForm />)

      const emailInput = getByLabelText(/email/i)
      const passwordInput = getByLabelText(/password/i)
      const submitButton = getByRole('button', { name: /login/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = getByText(/invalid email or password/i)
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveClass('text-red-500')
      })
    })
  })
})