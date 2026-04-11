'use client';

import { Bell, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
  onMarkAsRead: (id: number) => void;
}

export function NotificationCenter({
  notifications,
  onDismiss,
  onMarkAsRead,
}: NotificationCenterProps) {
  return (
    <div data-testid="notification-center" className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Bell className="w-6 h-6" />
        Notifications
      </h2>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              data-testid={`notification-${notification.id}`}
              className={`p-4 rounded-lg border-2 transition ${
                notification.read
                  ? 'border-gray-200 bg-white'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <p className="font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(notification.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <button
                  onClick={() => onDismiss(notification.id)}
                  data-testid="dismiss-notification"
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
