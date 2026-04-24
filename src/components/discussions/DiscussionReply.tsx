import { ThumbsUp, Edit2, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Reply {
  id: string;
  discussionId: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  isUpvoted: boolean;
}

interface DiscussionReplyProps {
  reply: Reply;
  currentUserId: string;
  onUpvote: (replyId: string) => void;
  onEdit?: (reply: Reply) => void;
  onDelete?: (replyId: string) => void;
}

/**
 * DiscussionReply Component - Display reply with upvoting
 * Shows reply content, author, upvotes, and edit/delete options
 */
export function DiscussionReply({
  reply,
  currentUserId,
  onUpvote,
  onEdit,
  onDelete,
}: DiscussionReplyProps) {
  const isAuthor = reply.authorId === currentUserId;
  const timeAgo = formatDistanceToNow(new Date(reply.updatedAt), { addSuffix: true });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this reply?')) {
      onDelete?.(reply.id);
    }
  };

  return (
    <div
      data-testid="discussion-reply"
      className="border-l-2 border-slate-200 pl-4 py-3 hover:bg-slate-50 rounded-r transition-colors"
    >
      {/* Header: Author and time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-700">{reply.author}</span>
          <span className="text-slate-400">•</span>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3" />
            <span data-testid="reply-timestamp">{timeAgo}</span>
          </div>
        </div>

        {/* Edit/Delete buttons */}
        {isAuthor && (
          <div className="flex gap-2">
            <button
              data-testid="reply-edit-btn"
              onClick={() => onEdit?.(reply)}
              className="p-1 hover:bg-blue-100 text-blue-600 rounded transition-colors"
              title="Edit reply"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              data-testid="reply-delete-btn"
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
              title="Delete reply"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-slate-700 mb-3 text-sm leading-relaxed">
        {reply.content}
      </p>

      {/* Upvote button */}
      <button
        data-testid="reply-upvote-btn"
        onClick={() => onUpvote(reply.id)}
        className={`flex items-center gap-2 px-2 py-1 text-xs rounded transition-colors ${
          reply.isUpvoted
            ? 'bg-blue-100 text-blue-600'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <ThumbsUp className="w-3 h-3" />
        <span>{reply.upvotes}</span>
      </button>
    </div>
  );
}
