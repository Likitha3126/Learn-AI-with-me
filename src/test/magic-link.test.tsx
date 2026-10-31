// src/test/magic-link.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SignInPage } from '../pages/SignInPage'
import { AuthCallbackPage } from '../pages/AuthCallbackPage'
import * as AuthContextModule from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

describe('Passwordless Email Magic Link Authentication', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('SignInPage - Magic Link Flow', () => {
    it('renders "Continue with email link" option in password mode', () => {
      render(
        <MemoryRouter>
          <SignInPage />
        </MemoryRouter>
      )

      expect(screen.getByRole('button', { name: /Continue with email link/i })).toBeInTheDocument()
    })

    it('switches to magic link form when "Continue with email link" is clicked', () => {
      render(
        <MemoryRouter>
          <SignInPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'learner@example.com' },
      })

      const continueWithEmailBtn = screen.getByRole('button', { name: /Continue with email link/i })
      fireEvent.click(continueWithEmailBtn)

      // Password input should no longer be present
      expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument()
      // Email should be preserved
      expect(screen.getByDisplayValue('learner@example.com')).toBeInTheDocument()
      // Submit button should be "Send Magic Link"
      expect(screen.getByRole('button', { name: /Send Magic Link/i })).toBeInTheDocument()
    })

    it('switches between tabs: Password and Email Link', () => {
      render(
        <MemoryRouter>
          <SignInPage />
        </MemoryRouter>
      )

      const emailLinkTab = screen.getByRole('tab', { name: /Email Link \(Passwordless\)/i })
      fireEvent.click(emailLinkTab)

      expect(screen.queryByPlaceholderText('••••••••')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Send Magic Link/i })).toBeInTheDocument()

      const passwordTab = screen.getByRole('tab', { name: /^Password$/i })
      fireEvent.click(passwordTab)

      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument()
    })

    it('validates empty email when submitting magic link form', async () => {
      render(
        <MemoryRouter initialEntries={['/signin?mode=magic-link']}>
          <SignInPage />
        </MemoryRouter>
      )

      const sendLinkBtn = screen.getByRole('button', { name: /Send Magic Link/i })
      fireEvent.submit(sendLinkBtn.closest('form')!)

      expect(await screen.findByText(/Please enter your email address/i)).toBeInTheDocument()
    })

    it('calls signInWithOtp with shouldCreateUser: false and displays confirmation screen on success', async () => {
      const mockSignInWithOtp = vi.fn().mockResolvedValue({ error: null })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: mockSignInWithOtp,
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter initialEntries={['/signin?mode=magic-link&redirectTo=%2Fday%2F5']}>
          <SignInPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'existing.learner@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }))

      expect(mockSignInWithOtp).toHaveBeenCalledWith('existing.learner@example.com', {
        redirectTo: '/day/5',
        shouldCreateUser: false,
      })

      // Confirmation screen
      expect(await screen.findByRole('heading', { level: 1, name: /Check your inbox!/i })).toBeInTheDocument()
      expect(screen.getByText('existing.learner@example.com')).toBeInTheDocument()
      expect(screen.getByText(/check your spam or junk folder/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Resend available in \d+s/i })).toBeInTheDocument()
    })

    it('handles non-existent user error by preventing account creation and prompting sign up', async () => {
      const mockSignInWithOtp = vi.fn().mockResolvedValue({
        error: {
          name: 'AuthApiError',
          message: 'Signups not allowed for otp',
          status: 400,
        },
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: mockSignInWithOtp,
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter initialEntries={['/signin?mode=magic-link']}>
          <SignInPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'unregistered@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }))

      expect(
        await screen.findByText(/No account found with this email address\. Please create an account first\./i)
      ).toBeInTheDocument()
      expect(screen.queryByRole('heading', { level: 1, name: /Check your inbox!/i })).not.toBeInTheDocument()
    })

    it('handles network error gracefully', async () => {
      const mockSignInWithOtp = vi.fn().mockResolvedValue({
        error: {
          name: 'AuthRetryableFetchError',
          message: 'Failed to fetch network request',
        },
      })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: mockSignInWithOtp,
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter initialEntries={['/signin?mode=magic-link']}>
          <SignInPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'offline@example.com' },
      })

      fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }))

      expect(
        await screen.findByText(/Network connection failed\. Please check your internet connection/i)
      ).toBeInTheDocument()
    })

    it('displays expired link notice when URL has error_code=otp_expired', async () => {
      render(
        <MemoryRouter initialEntries={['/signin?error_code=otp_expired']}>
          <SignInPage />
        </MemoryRouter>
      )

      expect(
        await screen.findByText(/Your sign-in link has expired or has already been used/i)
      ).toBeInTheDocument()
    })

    it('allows switching from confirmation view back to password login', async () => {
      const mockSignInWithOtp = vi.fn().mockResolvedValue({ error: null })

      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: mockSignInWithOtp,
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter initialEntries={['/signin?mode=magic-link']}>
          <SignInPage />
        </MemoryRouter>
      )

      fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
        target: { value: 'learner@example.com' },
      })
      fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }))

      expect(await screen.findByRole('heading', { level: 1, name: /Check your inbox!/i })).toBeInTheDocument()

      const usePasswordBtn = screen.getByRole('button', { name: /Use password instead/i })
      fireEvent.click(usePasswordBtn)

      // Should be back to password form with email retained
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
      expect(screen.getByDisplayValue('learner@example.com')).toBeInTheDocument()
    })
  })

  describe('AuthCallbackPage', () => {
    it('redirects immediately if user is already authenticated', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: { id: 'user-123', email: 'verified@example.com' } as any,
        session: { access_token: 'valid-token' } as any,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      render(
        <MemoryRouter initialEntries={['/auth/callback?redirectTo=%2Faccount']}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/account" element={<div>Account Destination</div>} />
          </Routes>
        </MemoryRouter>
      )

      expect(await screen.findByText('Account Destination')).toBeInTheDocument()
    })

    it('displays clear error UI and recovery actions when link is expired (otp_expired)', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      // Simulate expired error params
      render(
        <MemoryRouter initialEntries={['/auth/callback?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired']}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Routes>
        </MemoryRouter>
      )

      expect(await screen.findByRole('heading', { name: /Sign-in link expired/i })).toBeInTheDocument()
      expect(screen.getByText(/This magic link has expired or has already been used/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Request new link/i })).toHaveAttribute(
        'href',
        '/signin?mode=magic-link&redirectTo=%2Faccount'
      )
      expect(screen.getByRole('link', { name: /Sign in with password/i })).toHaveAttribute(
        'href',
        '/signin?redirectTo=%2Faccount'
      )
    })

    it('exchanges PKCE code and restores session', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      const mockExchange = vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'pkce-user' }, access_token: 'pkce-token' } },
        error: null,
      })
      vi.spyOn(supabase.auth, 'exchangeCodeForSession').mockImplementation(mockExchange)

      render(
        <MemoryRouter initialEntries={['/auth/callback?code=valid-pkce-code&redirectTo=%2Fmy-progress']}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/my-progress" element={<div>My Progress Destination</div>} />
          </Routes>
        </MemoryRouter>
      )

      expect(mockExchange).toHaveBeenCalledWith('valid-pkce-code')
      expect(await screen.findByText('My Progress Destination')).toBeInTheDocument()
    })

    it('handles PKCE exchange error when code has already been redeemed', async () => {
      vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
        user: null,
        session: null,
        profile: null,
        loading: false,
        isConfigured: true,
        signIn: vi.fn(),
        signInWithOtp: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPassword: vi.fn(),
        updatePassword: vi.fn(),
        resendVerificationEmail: vi.fn(),
        deleteAccount: vi.fn(),
        refreshProfile: vi.fn(),
      })

      vi.spyOn(supabase.auth, 'exchangeCodeForSession').mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'PKCE code has already been used or expired' } as any,
      })

      render(
        <MemoryRouter initialEntries={['/auth/callback?code=used-pkce-code']}>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
          </Routes>
        </MemoryRouter>
      )

      expect(await screen.findByRole('heading', { name: /Sign-in link expired/i })).toBeInTheDocument()
      expect(screen.getByText(/This sign-in link has expired or has already been redeemed/i)).toBeInTheDocument()
    })
  })

  describe('AuthContext - signInWithOtp Integration', () => {
    it('calls supabase.auth.signInWithOtp with origin-based redirect and shouldCreateUser: false', async () => {
      const mockOtp = vi.spyOn(supabase.auth, 'signInWithOtp').mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      })

      let resResult: any = null

      function TestOtpComponent() {
        const { signInWithOtp } = AuthContextModule.useAuth()
        return (
          <button
            onClick={async () => {
              const res = await signInWithOtp('Learner@Example.com', { redirectTo: '/day/10' })
              resResult = res
            }}
          >
            Trigger OTP
          </button>
        )
      }

      render(
        <AuthContextModule.AuthProvider>
          <TestOtpComponent />
        </AuthContextModule.AuthProvider>
      )

      fireEvent.click(screen.getByRole('button', { name: /Trigger OTP/i }))

      await waitFor(() => {
        expect(mockOtp).toHaveBeenCalledTimes(1)
      })

      const callArgs = mockOtp.mock.calls[0][0]
      expect(callArgs.email).toBe('learner@example.com')
      expect(callArgs.options?.shouldCreateUser).toBe(false)
      expect(callArgs.options?.emailRedirectTo).toBe(
        `${window.location.origin}/auth/callback?redirectTo=%2Fday%2F10`
      )
      expect(resResult).toEqual({ error: null })
    })
  })
})
