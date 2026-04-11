'use client';

import { useState } from 'react';
import { Mail, Bell } from 'lucide-react';
import { EmailPreferences, DigestPreview, NotificationCenter } from '@/components/email';

interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function EmailSettingsPage() {
  const [preferences, setPreferences] = useState([
    {
      id: 'contest_updates',
      label: 'Contest Updates',
      description: 'Get notified about new contests and updates',
      enabled: true,
    },
    {
      id: 'submission_updates',
      label: 'Submission Updates',
      description: 'Get notified when your submissions are judged',
      enabled: true,
    },
    {
      id: 'discussion_replies',
      label: 'Discussion Replies',
      description: 'Get notified when someone replies to your discussions',
      enabled: true,
    },
    {
      id: 'upvote_notifications',
      label: 'Upvote Notifications',
      description: 'Get notified when your posts get upvoted',
      enabled: false,
    },
    {
      id: 'leaderboard_updates',
      label: 'Leaderboard Updates',
      description: 'Get weekly leaderboard rankings',
      enabled: true,
    },
    {
      id: 'follower_activity',
      label: 'Follower Activity',
      description: 'Get notified about followed users activity',
      enabled: false,
    },
  ]);

  const [emailFrequency, setEmailFrequency] = useState<'IMMEDIATE' | 'DAILY' | 'WEEKLY'>(
    'WEEKLY',
  );
  const [email, setEmail] = useState('user@example.com');
  const [showDigestPreview, setShowDigestPreview] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'CONTEST_START',
      message: 'A new contest has started',
      timestamp: '2024-01-15T10:00:00Z',
      read: false,
    },
    {
      id: 2,
      type: 'SUBMISSION_RESULT',
      message: 'Your submission was accepted',
      timestamp: '2024-01-15T09:00:00Z',
      read: true,
    },
  ]);

  const handlePreferenceChange = (id: string, enabled: boolean) => {
    setPreferences(
      preferences.map((p) => (p.id === id ? { ...p, enabled } : p)),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-blue-600" />
            Email & Notification Settings
          </h1>
          <p className="text-gray-600">
            Manage your email preferences and notification settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2">
            <EmailPreferences
              preferences={preferences}
              emailFrequency={emailFrequency}
              email={email}
              onPreferenceChange={handlePreferenceChange}
              onFrequencyChange={setEmailFrequency}
              onEmailChange={setEmail}
              onVerifyEmail={() => console.log('Verify email:', email)}
              onUnsubscribeAll={() => console.log('Unsubscribe from all')}
            />

            {/* Digest Preview Button */}
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Digest</h3>
              <button
                onClick={() => setShowDigestPreview(true)}
                data-testid="preview-digest-btn"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Preview Digest
              </button>
            </div>
          </div>

          {/* Notification Center Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <Bell className="w-5 h-5 text-blue-600" />
                Recent Activity
              </h3>
              <NotificationCenter
                notifications={notifications.slice(0, 3)}
                onDismiss={(id) =>
                  setNotifications(notifications.filter((n) => n.id !== id))
                }
                onMarkAsRead={(id) =>
                  setNotifications(
                    notifications.map((n) =>
                      n.id === id ? { ...n, read: true } : n,
                    ),
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Digest Preview Modal */}
        <DigestPreview
          isOpen={showDigestPreview}
          onClose={() => setShowDigestPreview(false)}
          subject="Your Weekly Digest"
          previewHtml={`
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Your Weekly Summary</h2>
              <p>This week you solved 5 problems and participated in 1 contest.</p>
              <h3>Top Problems</h3>
              <ul>
                <li>Two Sum - Easy</li>
                <li>Merge Intervals - Medium</li>
                <li>Word Ladder - Hard</li>
              </ul>
              <h3>Leaderboard Position</h3>
              <p>You improved from rank 1,234 to rank 1,150 this week!</p>
            </div>
          `}
          deliveryDay="Monday"
        />
      </div>
    </div>
  );
}
