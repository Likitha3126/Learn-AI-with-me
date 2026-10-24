// src/test/auth-flow.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SignInPage } from '../pages/SignInPage'
import { SignUpPage } from '../pages/SignUpPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../pages/ResetPasswordPage'
import { AccountPage } from '../pages/AccountPage'
import * as AuthContextModule from '../contexts/AuthContext'

describe('Authentication Pages & Flows', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('SignInPage', () => {
    it('validates empty email and password submission', async () => {
      render(
        <MemoryRouter>
          <SignInPage />
        </MemoryRouter>
      )

      const submitButton = screen.getByRole('button', { name: /Sign In/i })
      fireEvent.submit(submitButton.closest('form')!)

      expect(await screen.findByText(/Please enter both your email and password/i)).toBeInTheDocument()
    })

    it('displays error message when signIn fails', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        error: { message: 'Invalid login credentials' },
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: mockSignIn,
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <SignInPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'user@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('••••••••'), {
        target: { value: 'wrong-password' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

      expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument()
    })
  })

  describe('SignUpPage', () => {
    it('enforces minimum 6 character password', async () => {
      render(
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'newuser@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
        target: { value: '123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

      expect(
        await screen.findByText(/Password must be at least 6 characters long/i)
      ).toBeInTheDocument()
    })

    it('shows dedicated confirmation screen with entered email and spam folder tip when verification is required', async () => {
      const mockSignUp = vi.fn().mockResolvedValue({
        error: null,
        user: {
          id: 'new-user-123',
          email: 'learner.jane@example.com',
          confirmation_sent_at: '2026-10-24T00:00:00Z',
          confirmed_at: null,
        },
        session: null,
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: mockSignUp,
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'learner.jane@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
        target: { value: 'securepassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

      expect(await screen.findByRole('heading', { level: 1, name: /Check your inbox!/i })).toBeInTheDocument()
      expect(screen.getByText('learner.jane@example.com')).toBeInTheDocument()
      expect(screen.getByText(/check your spam or junk folder/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Back to Sign In/i })).toHaveAttribute(
        'href',
        '/signin?redirectTo=%2Faccount'
      )
    })

    it('handles resend confirmation email with success state and cooldown', async () => {
      const mockResend = vi.fn().mockResolvedValue({ error: null })
      const mockSignUp = vi.fn().mockResolvedValue({
        error: null,
        user: {
          id: 'new-user-123',
          email: 'resend.user@example.com',
          confirmed_at: null,
        },
        session: null,
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: mockSignUp,
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: mockResend,
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'resend.user@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
        target: { value: 'securepassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

      expect(await screen.findByRole('heading', { level: 1, name: /Check your inbox!/i })).toBeInTheDocument()

      const resendButton = screen.getByRole('button', { name: /Resend confirmation email/i })
      fireEvent.click(resendButton)

      expect(mockResend).toHaveBeenCalledWith('resend.user@example.com')
      expect(await screen.findByText(/A fresh confirmation link has been sent/i)).toBeInTheDocument()
      expect(screen.getByText(/Resend available in \d+s/i)).toBeInTheDocument()
    })

    it('handles resend error state without falsely claiming success', async () => {
      const mockResend = vi.fn().mockResolvedValue({
        error: { message: 'Too many requests. Please wait a minute.' },
      })
      const mockSignUp = vi.fn().mockResolvedValue({
        error: null,
        user: {
          id: 'new-user-123',
          email: 'error.user@example.com',
          confirmed_at: null,
        },
        session: null,
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: mockSignUp,
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: mockResend,
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'error.user@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
        target: { value: 'securepassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

      expect(await screen.findByRole('heading', { level: 1, name: /Check your inbox!/i })).toBeInTheDocument()

      const resendButton = screen.getByRole('button', { name: /Resend confirmation email/i })
      fireEvent.click(resendButton)

      expect(await screen.findByText('Too many requests. Please wait a minute.')).toBeInTheDocument()
      expect(screen.queryByText(/A fresh confirmation link has been sent/i)).not.toBeInTheDocument()
    })

    it('does not show confirmation screen when signup fails with an error', async () => {
      const mockSignUp = vi.fn().mockResolvedValue({
        error: { message: 'Network connection failed' },
        user: null,
        session: null,
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: mockSignUp,
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'fail@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
        target: { value: 'securepassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

      expect(await screen.findByText('Network connection failed')).toBeInTheDocument()
      expect(screen.queryByRole('heading', { level: 1, name: /Check your inbox!/i })).not.toBeInTheDocument()
    })

    it('handles existing account error (empty identities)', async () => {
      const mockSignUp = vi.fn().mockResolvedValue({
        error: null,
        user: {
          id: 'existing-user-123',
          email: 'existing@example.com',
          identities: [],
        },
        session: null,
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: mockSignUp,
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <SignUpPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'existing@example.com' },
      })
      fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), {
        target: { value: 'securepassword123' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

      expect(
        await screen.findByText(/An account with this email address already exists\. Please sign in\./i)
      ).toBeInTheDocument()
      expect(screen.queryByRole('heading', { level: 1, name: /Check your inbox!/i })).not.toBeInTheDocument()
    })
  })

  describe('ForgotPasswordPage', () => {
    it('handles password recovery email dispatch and success state', async () => {
      const mockResetPassword = vi.fn().mockResolvedValue({ error: null })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: mockResetPassword,
        updatePassword: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <ForgotPasswordPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'learner@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }))

      expect(await screen.findByText(/Reset link dispatched/i)).toBeInTheDocument()
    })
  })

  describe('ResetPasswordPage', () => {
    it('validates password mismatch before calling updatePassword', async () => {
      render(
        <MemoryRouter>
          <ResetPasswordPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('At least 6 characters'), { target: { value: 'newpassword123' } })
      fireEvent.change(screen.getByPlaceholderText('Repeat password'), { target: { value: 'differentpassword' } })

      fireEvent.click(screen.getByRole('button', { name: /Update Password/i }))

      expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument()
    })
  })

  describe('AccountPage', () => {
    it('shows signed-out call to action when unauthenticated', () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <AccountPage />
        </MemoryRouter>
      )

      expect(
        screen.getByRole('heading', { level: 1, name: /Sign in to view your account/i })
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Sign In/i })).toHaveAttribute('href', '/signin')
    })

    it('renders user details and delete account confirmation when authenticated', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: {
          id: 'user-789',
          email: 'active.learner@example.com',
          created_at: '2026-01-01T00:00:00Z',
        } as any,
        session: {} as any,
        profile: {
          id: 'user-789',
          display_name: 'Alex AI',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
        },
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter>
          <AccountPage />
        </MemoryRouter>
      )

      expect(screen.getByRole('heading', { level: 1, name: 'Alex AI' })).toBeInTheDocument()
      expect(screen.getAllByText('active.learner@example.com').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Joined Jan 1, 2026')).toBeInTheDocument()

      // Test delete button confirmation trigger
      const deleteButton = screen.getByRole('button', { name: /Delete Account/i })
      fireEvent.click(deleteButton)

      expect(
        screen.getByRole('button', { name: /Yes, delete everything permanently/i })
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument()
    })
  })
})
