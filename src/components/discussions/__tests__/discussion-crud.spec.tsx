import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscussionThread } from '../DiscussionThread';
import { DiscussionForm } from '../DiscussionForm';
import { DiscussionReply } from '../DiscussionReply';

/**
 * Component Tests - Discussion CRUD & Upvoting
 * Tests for discussion threads, forms, and replies
 */

describe('DiscussionThread Component', () => {
  const mockDiscussion = {
    id: 'disc-1',
    problemId: 123,
    authorId: 'user-2',
    author: 'alice',
    title: 'How to solve this?',
    content: 'What is the best approach?',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upvotes: 5,
    replies: 2,
    isUpvoted: false,
  };

  it('should display discussion thread', () => {
    render(
      <DiscussionThread
        discussion={mockDiscussion}
        currentUserId="user-1"
        onUpvote={jest.fn()}
      />,
    );

    expect(screen.getByText('How to solve this?')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('What is the best approach?')).toBeInTheDocument();
  });

  it('should display upvote count', () => {
    render(
      <DiscussionThread
        discussion={mockDiscussion}
        currentUserId="user-1"
        onUpvote={jest.fn()}
      />,
    );

    const upvoteButton = screen.getByTestId('discussion-upvote-btn');
    expect(upvoteButton).toHaveTextContent('5');
  });

  it('should display reply count', () => {
    render(
      <DiscussionThread
        discussion={mockDiscussion}
        currentUserId="user-1"
        onUpvote={jest.fn()}
      />,
    );

    const replyBadge = screen.getByTestId('reply-count');
    expect(replyBadge).toHaveTextContent('2');
  });

  it('should highlight upvote button if user has upvoted', () => {
    render(
      <DiscussionThread
        discussion={{ ...mockDiscussion, isUpvoted: true }}
        currentUserId="user-1"
        onUpvote={jest.fn()}
      />,
    );

    const upvoteButton = screen.getByTestId('discussion-upvote-btn');
    expect(upvoteButton).toHaveClass('text-blue-600');
  });

  it('should call onUpvote when upvote button clicked', async () => {
    const onUpvote = jest.fn();
    const user = userEvent.setup();

    render(
      <DiscussionThread
        discussion={mockDiscussion}
        currentUserId="user-1"
        onUpvote={onUpvote}
      />,
    );

    const upvoteButton = screen.getByTestId('discussion-upvote-btn');
    await user.click(upvoteButton);

    expect(onUpvote).toHaveBeenCalledWith('disc-1');
  });

  it('should show edit/delete buttons for author', () => {
    render(
      <DiscussionThread
        discussion={mockDiscussion}
        currentUserId="user-2"
        onUpvote={jest.fn()}
      />,
    );

    const editButton = screen.getByTestId('discussion-edit-btn');
    const deleteButton = screen.getByTestId('discussion-delete-btn');

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should not show edit/delete buttons for non-author', () => {
    render(
      <DiscussionThread
        discussion={mockDiscussion}
        currentUserId="user-1"
        onUpvote={jest.fn()}
      />,
    );

    const editButton = screen.queryByTestId('discussion-edit-btn');
    const deleteButton = screen.queryByTestId('discussion-delete-btn');

    expect(editButton).not.toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should display last updated time', () => {
    const now = new Date();
    render(
      <DiscussionThread
        discussion={{
          ...mockDiscussion,
          updatedAt: now.toISOString(),
        }}
        currentUserId="user-1"
        onUpvote={jest.fn()}
      />,
    );

    const timestamp = screen.getByTestId('discussion-timestamp');
    expect(timestamp).toBeInTheDocument();
  });
});

describe('DiscussionForm Component', () => {
  it('should render discussion form', () => {
    render(<DiscussionForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    const titleInput = screen.getByTestId('discussion-title-input');
    const contentInput = screen.getByTestId('discussion-content-input');

    expect(titleInput).toBeInTheDocument();
    expect(contentInput).toBeInTheDocument();
  });

  it('should submit discussion form with title and content', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    render(<DiscussionForm onSubmit={onSubmit} onCancel={jest.fn()} />);

    const titleInput = screen.getByTestId('discussion-title-input');
    const contentInput = screen.getByTestId('discussion-content-input');

    await user.type(titleInput, 'New Discussion');
    await user.type(contentInput, 'This is the content');

    const submitButton = screen.getByTestId('submit-discussion-btn');
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'New Discussion',
      content: 'This is the content',
    });
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();

    render(<DiscussionForm onSubmit={jest.fn()} onCancel={jest.fn()} />);

    const submitButton = screen.getByTestId('submit-discussion-btn');
    await user.click(submitButton);

    const titleError = screen.getByTestId('title-error');
    const contentError = screen.getByTestId('content-error');

    expect(titleError).toHaveTextContent('Title is required');
    expect(contentError).toHaveTextContent('Content is required');
  });

  it('should populate form for editing', () => {
    const initialValues = {
      title: 'Existing Title',
      content: 'Existing content',
    };

    render(
      <DiscussionForm
        initialValues={initialValues}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />,
    );

    const titleInput = screen.getByTestId('discussion-title-input') as HTMLInputElement;
    const contentInput = screen.getByTestId('discussion-content-input') as HTMLTextAreaElement;

    expect(titleInput.value).toBe('Existing Title');
    expect(contentInput.value).toBe('Existing content');
  });

  it('should call onCancel when cancel button clicked', async () => {
    const onCancel = jest.fn();
    const user = userEvent.setup();

    render(<DiscussionForm onSubmit={jest.fn()} onCancel={onCancel} />);

    const cancelButton = screen.getByTestId('cancel-discussion-btn');
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should disable submit button while submitting', async () => {
    const user = userEvent.setup();

    render(
      <DiscussionForm
        onSubmit={async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }}
        onCancel={jest.fn()}
        isSubmitting={true}
      />,
    );

    const submitButton = screen.getByTestId('submit-discussion-btn');
    expect(submitButton).toBeDisabled();
  });
});

describe('DiscussionReply Component', () => {
  const mockReply = {
    id: 'reply-1',
    discussionId: 'disc-1',
    authorId: 'user-1',
    author: 'testuser',
    content: 'This is a great solution',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upvotes: 3,
    isUpvoted: false,
  };

  it('should display reply content', () => {
    render(
      <DiscussionReply
        reply={mockReply}
        currentUserId="user-2"
        onUpvote={jest.fn()}
      />,
    );

    expect(screen.getByText('This is a great solution')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should display reply upvote count', () => {
    render(
      <DiscussionReply
        reply={mockReply}
        currentUserId="user-2"
        onUpvote={jest.fn()}
      />,
    );

    const upvoteButton = screen.getByTestId('reply-upvote-btn');
    expect(upvoteButton).toHaveTextContent('3');
  });

  it('should highlight upvote if user has upvoted reply', () => {
    render(
      <DiscussionReply
        reply={{ ...mockReply, isUpvoted: true }}
        currentUserId="user-2"
        onUpvote={jest.fn()}
      />,
    );

    const upvoteButton = screen.getByTestId('reply-upvote-btn');
    expect(upvoteButton).toHaveClass('text-blue-600');
  });

  it('should call onUpvote when reply upvote clicked', async () => {
    const onUpvote = jest.fn();
    const user = userEvent.setup();

    render(
      <DiscussionReply
        reply={mockReply}
        currentUserId="user-2"
        onUpvote={onUpvote}
      />,
    );

    const upvoteButton = screen.getByTestId('reply-upvote-btn');
    await user.click(upvoteButton);

    expect(onUpvote).toHaveBeenCalledWith('reply-1');
  });

  it('should show edit/delete for reply author', () => {
    render(
      <DiscussionReply
        reply={mockReply}
        currentUserId="user-1"
        onUpvote={jest.fn()}
      />,
    );

    const editButton = screen.getByTestId('reply-edit-btn');
    const deleteButton = screen.getByTestId('reply-delete-btn');

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('should not show edit/delete for non-author', () => {
    render(
      <DiscussionReply
        reply={mockReply}
        currentUserId="user-2"
        onUpvote={jest.fn()}
      />,
    );

    const editButton = screen.queryByTestId('reply-edit-btn');
    const deleteButton = screen.queryByTestId('reply-delete-btn');

    expect(editButton).not.toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should display reply timestamp', () => {
    render(
      <DiscussionReply
        reply={mockReply}
        currentUserId="user-2"
        onUpvote={jest.fn()}
      />,
    );

    const timestamp = screen.getByTestId('reply-timestamp');
    expect(timestamp).toBeInTheDocument();
  });
});
