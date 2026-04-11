'use client';

import { useState, useEffect } from 'react';
import { EmailPreferences, DigestPreview, NotificationCenter } from '@/components/email';

interface EmailPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function EmailSettingsPage() {
  const [preferences, setPreferences] = useState<EmailPref[]>([
    {
      id: 'contest_updates',
      label: 'Contest Updates',
      description: 'Get notified about new contests',
      enabled: true,
    },
    {
      id: 'submission_updates',
      label: 'Submission Results',
      description: 'Get notified when submissions are judged',
      enabled: true,
    },
    {
      id: 'discussion_replies',
      label: 'Discussion Replies',
      description: 'Get notified of replies to your discussions',
      enabled: false,
    },
  ]);

  const [frequency, setFrequency] = useState<'IMMEDIATE' | 'DAILY' | 'WEEKLY'>('WEEKLY');
  const [email, setEmail] = useState('user@example.com');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handlePreferenceChange = (id: string, enabled: boolean) => {
    setPreferences(
      preferences.map((p) => (p.id === id ? { ...p, enabled } : p))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <EmailPreferences
          preferences={preferences}
          emailFrequency={frequency}
          email={email}
          onPreferenceChange={handlePreferenceChange}
          onFrequencyChange={setFrequency}
          onEmailChange={setEmail}
          onVerifyEmail={() => console.log('Verify email')}
          onUnsubscribeAll={() => console.log('Unsubscribe all')}
        />

        <div className="mt-12">
          <NotificationCenter
            notifications={notifications}
            onDismiss={(id) =>
              setNotifications(notifications.filter((n) => n.id !== id))
            }
            onMarkAsRead={(id) =>
              setNotifications(
                notifications.map((n) =>
                  n.id === id ? { ...n, read: true } : n
                )
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
