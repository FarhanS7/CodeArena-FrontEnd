'use client';

import { useState, useEffect } from 'react';
import { EmailPreferences, DigestPreview, NotificationCenter } from '@/components/email';

interface EmailPreferenceItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function EmailSettingsPage() {
  const [preferences, setPreferences] = useState<EmailPreferenceItem[]>([
    {
      id: 'contest_updates',
      label: 'Contest Updates',
      description: 'Get notified about new contests and updates',
      enabled: true,
    },
    {
      id: 'submission_updates',
      label: 'Submission Updates',
      description: 'Get notified when your submission is judged',
      enabled: true,
    },
    {
      id: 'discussion_replies',
      label: 'Discussion Replies',
      description: 'Get notified when someone replies to your discussion',
      enabled: true,
    },
    {
      id: 'upvote_notifications',
      label: 'Upvote Notifications',
      description: 'Get notified when your posts get upvoted',
      enabled: false,
    },
    {
      id: 'follower_activity',
      label: 'Follower Activity',
      description: 'Get notified when users you follow solve problems',
      enabled: false,
    },
  ]);

  const [email, setEmail] = useState('user@example.com');
  const [emailFrequency, setEmailFrequency] = useState<'IMMEDIATE' | 'DAILY' | 'WEEKLY'>('WEEKLY');
  const [showDigestPreview, setShowDigestPreview] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: 1,
      type: 'CONTEST_START',
      message: 'Weekly Contest 1 has started',
      timestamp: '2024-01-15T10:00:00Z',
      read: false,
    },
  ]);

  useEffect(() => {
    // Load preferences from API
    // For now using mock data
  }, []);

  const handlePreferenceChange = (id: string, enabled: boolean) => {
    setPreferences((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)));
  };

  const handleFrequencyChange = (frequency: 'IMMEDIATE' | 'DAILY' | 'WEEKLY') => {
    setEmailFrequency(frequency);
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handleVerifyEmail = () => {
    alert(`Verification email sent to ${email}`);
  };

  const handleUnsubscribeAll = () => {
    if (confirm('This will unsubscribe you from all emails. Are you sure?')) {
      setPreferences((prev) => prev.map((p) => ({ ...p, enabled: false })));
    }
  };

  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Email Settings</h1>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200 flex gap-4">
        <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
          Preferences
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
          Notifications
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preferences Panel */}
        <div className="lg:col-span-2">
          <EmailPreferences
            preferences={preferences}
            emailFrequency={emailFrequency}
            email={email}
            onPreferenceChange={handlePreferenceChange}
            onFrequencyChange={handleFrequencyChange}
            onEmailChange={handleEmailChange}
            onVerifyEmail={handleVerifyEmail}
            onUnsubscribeAll={handleUnsubscribeAll}
          />
        </div>

        {/* Sidebar - Digest Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold mb-3">Weekly Digest</h3>
            <button
              data-testid="preview-digest-btn"
              onClick={() => setShowDigestPreview(true)}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-3"
            >
              Preview Digest
            </button>

            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Activity Summary</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Popular Problems</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span className="text-sm">Trending Discussions</span>
              </label>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold">Delivery Day</label>
              <select
                data-testid="digest-day-select"
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded"
              >
                <option>Monday</option>
                <option>Wednesday</option>
                <option>Friday</option>
                <option>Sunday</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Email Activity</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <p>Emails received: 42</p>
              <p>Opened rate: 68%</p>
              <p>Last email: 2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Digest Preview Modal */}
      <DigestPreview
        isOpen={showDigestPreview}
        onClose={() => setShowDigestPreview(false)}
        subject="Your Weekly Code Arena Digest"
        previewHtml="<h2>Your Weekly Summary</h2><p>You solved 5 problems this week. Keep it up!</p><p>Trending: Two Sum (50k searches)</p>"
        deliveryDay="Every Sunday"
      />
    </div>
  );
}
