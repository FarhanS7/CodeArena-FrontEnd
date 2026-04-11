import { render, screen, fireEvent } from '@testing-library/react';
import { EmailPreferences, DigestPreview, NotificationCenter } from '@/components/email';

describe('EmailPreferences Component', () => {
  const mockPreferences = [
    {
      id: 'contest_updates',
      label: 'Contest Updates',
      description: 'Get notified about contests',
      enabled: true,
    },
  ];

  it('renders email preferences', () => {
    render(
      <EmailPreferences
        preferences={mockPreferences}
        emailFrequency="WEEKLY"
        email="test@example.com"
        onPreferenceChange={() => {}}
        onFrequencyChange={() => {}}
        onEmailChange={() => {}}
        onVerifyEmail={() => {}}
        onUnsubscribeAll={() => {}}
      />,
    );
    expect(screen.getByText('Email Preferences')).toBeInTheDocument();
  });
});

describe('DigestPreview Component', () => {
  it('renders digest preview when open', () => {
    render(
      <DigestPreview
        isOpen={true}
        onClose={() => {}}
        subject="Weekly Digest"
        previewHtml="<p>Content</p>"
      />,
    );
    expect(screen.getByTestId('digest-preview-modal')).toBeInTheDocument();
  });
});

describe('NotificationCenter Component', () => {
  it('renders notifications', () => {
    const notifications = [
      {
        id: 1,
        type: 'TEST',
        message: 'Test message',
        timestamp: '2024-01-15T10:00:00Z',
        read: false,
      },
    ];

    render(
      <NotificationCenter
        notifications={notifications}
        onDismiss={() => {}}
        onMarkAsRead={() => {}}
      />,
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
