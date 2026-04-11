'use client';

import { X, Calendar } from 'lucide-react';

interface DigestPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  previewHtml: string;
  deliveryDay?: string;
}

export function DigestPreview({
  isOpen,
  onClose,
  subject,
  previewHtml,
  deliveryDay,
}: DigestPreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        data-testid="digest-preview-modal"
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-96 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold">{subject}</h2>
            {deliveryDay && (
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                Delivers every {deliveryDay}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Preview Content */}
        <div
          className="p-6 space-y-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
