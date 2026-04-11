'use client';

import { useState } from 'react';
import { Bell, Mail, Clock } from 'lucide-react';

interface EmailPreferenceItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface EmailPreferencesProps {
  preferences: EmailPreferenceItem[];
  emailFrequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
  email: string;
  onPreferenceChange: (id: string, enabled: boolean) => void;
  onFrequencyChange: (frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY') => void;
  onEmailChange: (email: string) => void;
  onVerifyEmail: () => void;
  onUnsubscribeAll: () => void;
}

export function EmailPreferences({
  preferences,
  emailFrequency,
  email,
  onPreferenceChange,
  onFrequencyChange,
  onEmailChange,
  onVerifyEmail,
  onUnsubscribeAll,
}: EmailPreferencesProps) {
  const [editingEmail, setEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);

  return (
    <div data-testid="email-preferences-title" className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Email Preferences</h1>

      {/* Email Address Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Address
        </h2>

        <div className="space-y-3">
          {editingEmail ? (
            <div className="flex gap-2">
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                data-testid="email-input"
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => {
                  onEmailChange(tempEmail);
                  setEditingEmail(false);
                }}
                data-testid="verify-email-btn"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{email}</span>
              <button
                onClick={() => setEditingEmail(true)}
                className="text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Types
        </h2>

        <div data-testid="notification-types" className="space-y-4">
          {preferences.map((pref) => (
            <label
              key={pref.id}
              className="flex items-center p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={pref.enabled}
                onChange={(e) => onPreferenceChange(pref.id, e.target.checked)}
                data-testid={`toggle-${pref.id}`}
                className="w-4 h-4 rounded"
              />
              <div className="ml-3">
                <p className="font-medium">{pref.label}</p>
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Frequency Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Email Frequency
        </h2>

        <select
          value={emailFrequency}
          onChange={(e) =>
            onFrequencyChange(e.target.value as 'IMMEDIATE' | 'DAILY' | 'WEEKLY')
          }
          data-testid="email-frequency-select"
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="IMMEDIATE">Immediate</option>
          <option value="DAILY">Daily Digest</option>
          <option value="WEEKLY">Weekly Digest</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onUnsubscribeAll}
          data-testid="unsubscribe-all-btn"
          className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
        >
          Unsubscribe from All
        </button>
      </div>
    </div>
  );
}
