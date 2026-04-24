import { useState, useEffect, useCallback } from 'react';
import { EmailService, EmailPreference, DigestSettings, EmailNotification } from '@/lib/api';

// useEmailPreferences Hook
export function useEmailPreferences() {
  const [preferences, setPreferences] = useState<EmailPreference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await EmailService.getEmailPreferences();
      setPreferences(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreference = useCallback(async (id: string, enabled: boolean) => {
    try {
      await EmailService.updateEmailPreference(id, enabled);
      setPreferences((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enabled } : p)),
      );
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return { preferences, isLoading, error, updatePreference, reload: loadPreferences };
}

// useDigestSettings Hook
export function useDigestSettings() {
  const [settings, setSettings] = useState<DigestSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await EmailService.getDigestSettings();
      setSettings(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (updates: Partial<DigestSettings>) => {
    try {
      await EmailService.updateDigestSettings(updates);
      setSettings((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return { settings, isLoading, error, updateSettings, reload: loadSettings };
}

// useEmailNotifications Hook
export function useEmailNotifications() {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await EmailService.getEmailNotifications(page);
      setNotifications(response.data.data);
      setTotal(response.data.total);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dismiss = useCallback(async (id: number) => {
    try {
      await EmailService.dismissNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await EmailService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    total,
    isLoading,
    error,
    dismiss,
    markAsRead,
    reload: loadNotifications,
  };
}

// useDigestPreview Hook
export function useDigestPreview() {
  const [preview, setPreview] = useState<{
    subject: string;
    previewHtml: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await EmailService.previewDigest();
      setPreview(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { preview, isLoading, error, loadPreview };
}
