import { ThumbsUp, MessageCircle, Edit2, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Discussion {
  id: string;
  problemId: number;
  authorId: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  replies: number;
  isUpvoted: boolean;
}

interface DiscussionThreadProps {
  discussion: Discussion;
  currentUserId: string;
  onUpvote: (discussionId: string) => void;
  onEdit?: (discussion: Discussion) => void;
  onDelete?: (discussionId: string) => void;
  onExpand?: (discussionId: string) => void;
  isExpanded?: boolean;
}

/**
 * DiscussionThread Component - Display problem discussion with upvoting
 * Shows thread title, content, author, upvotes, and reply count
 */
export function DiscussionThread({
  discussion,
  currentUserId,
  onUpvote,
  onEdit,
  onDelete,
  onExpand,
  isExpanded,
}: DiscussionThreadProps) {
  const isAuthor = discussion.authorId === currentUserId;
  const timeAgo = formatDistanceToNow(new Date(discussion.updatedAt), { addSuffix: true });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this discussion?')) {
      onDelete?.(discussion.id);
    }
  };

  return (
    <div
      data-testid="discussion-thread"
      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
    >
      {/* Header: Title and author info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {discussion.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">{discussion.author}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span data-testid="discussion-timestamp">{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Edit/Delete buttons */}
        {isAuthor && (
          <div className="flex gap-2">
            <button
              data-testid="discussion-edit-btn"
              onClick={() => onEdit?.(discussion)}
              className="p-2 hover:bg-blue-100 text-blue-600 rounded transition-colors"
              title="Edit discussion"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              data-testid="discussion-delete-btn"
              onClick={handleDelete}
              className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
              title="Delete discussion"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-700 mt-3 mb-4 leading-relaxed">
        {discussion.content}
      </p>

      {/* Footer: Upvotes and replies */}
      <div className="flex items-center gap-6 text-sm">
        <button
          data-testid="discussion-upvote-btn"
          onClick={() => onUpvote(discussion.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            discussion.isUpvoted
              ? 'bg-blue-100 text-blue-600'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{discussion.upvotes}</span>
        </button>

        <button
          onClick={() => onExpand?.(discussion.id)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span data-testid="reply-count">{discussion.replies}</span>
          <span className="ml-1">{isExpanded ? 'Hide' : 'View'}</span>
        </button>
      </div>
    </div>
  );
}
