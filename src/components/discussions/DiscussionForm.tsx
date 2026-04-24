'use client';

import { useState } from 'react';

interface DiscussionFormProps {
  initialValues?: {
    title: string;
    content: string;
  };
  isSubmitting?: boolean;
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
}

/**
 * DiscussionForm Component - Create or edit discussion thread
 * Form with title and content validation
 */
export function DiscussionForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: DiscussionFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({ title, content });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
          Discussion Title
        </label>
        <input
          data-testid="discussion-title-input"
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors({ ...errors, title: '' });
            }
          }}
          placeholder="What is your question or topic?"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p data-testid="title-error" className="text-red-600 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* Content Input */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
          Discussion Content
        </label>
        <textarea
          data-testid="discussion-content-input"
          id="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) {
              setErrors({ ...errors, content: '' });
            }
          }}
          placeholder="Write your discussion details here..."
          rows={5}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.content && (
          <p data-testid="content-error" className="text-red-600 text-sm mt-1">
            {errors.content}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          data-testid="cancel-discussion-btn"
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          data-testid="submit-discussion-btn"
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Discussion'}
        </button>
      </div>
    </form>
  );
}
