'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

interface Settings {
  emailOnNewContest: boolean;
  emailOnAccepted: boolean;
  emailWeeklyDigest: boolean;
}

/**
 * Profile Settings Page - Update user preferences and settings
 * Allows managing email notifications and other preferences
 */
export default function ProfileSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [settings, setSettings] = useState<Settings>({
    emailOnNewContest: true,
    emailOnAccepted: false,
    emailWeeklyDigest: true,
  });

  useEffect(() => {
    // Fetch current settings from backend
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        const response = await fetch('/api/users/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to load settings');
        const data = await response.json();
        setSettings(data.settings);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      const token = localStorage.getItem('auth_token');

      // Call real backend API to save settings
      const response = await fetch('/api/users/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSuccessMessage('Settings updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-600 mt-2">Manage your preferences and notifications</p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Settings Page Container */}
        <div data-testid="settings-page" className="bg-white rounded-lg shadow">
          {/* Email Notifications Section */}
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Email Notifications</h2>

            <div className="space-y-4">
              {/* Contest Notification */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Notify on new contests
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Receive email when a new contest is published
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailOnNewContest}
                  onChange={() => handleToggle('emailOnNewContest')}
                  className="w-5 h-5 rounded"
                />
              </div>

              {/* Accepted Notification */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <label
                    htmlFor="email-on-accepted-toggle"
                    className="text-sm font-medium text-slate-900"
                  >
                    Notify on accepted solutions
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Receive email when your solution is accepted
                  </p>
                </div>
                <input
                  id="email-on-accepted-toggle"
                  data-testid="email-on-accepted-toggle"
                  type="checkbox"
                  checked={settings.emailOnAccepted}
                  onChange={() => handleToggle('emailOnAccepted')}
                  className="w-5 h-5 rounded"
                />
              </div>

              {/* Weekly Digest */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    Weekly digest
                  </label>
                  <p className="text-sm text-slate-500 mt-1">
                    Receive a weekly summary of your activity
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailWeeklyDigest}
                  onChange={() => handleToggle('emailWeeklyDigest')}
                  className="w-5 h-5 rounded"
                />
              </div>
            </div>
          </div>

          {/* Other Settings Section (placeholder for future) */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Privacy Settings</h2>
            <div className="p-4 bg-slate-50 rounded-lg text-slate-600">
              <p className="text-sm">More privacy settings coming soon...</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
