import { useState, useCallback } from 'react';
import { EmailService } from '@/lib/api';

// useEmailVerification Hook
export function useEmailVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendVerification = useCallback(async (email: string, token: string) => {
    setIsLoading(true);
    setSuccess(false);
    try {
      await EmailService.sendVerificationEmail(email, token);
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, success, sendVerification };
}

// usePasswordResetEmail Hook
export function usePasswordResetEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendReset = useCallback(async (email: string, token: string) => {
    setIsLoading(true);
    setSuccess(false);
    try {
      await EmailService.sendResetPasswordEmail(email, token);
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, success, sendReset };
}
