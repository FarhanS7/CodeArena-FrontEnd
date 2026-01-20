export interface Comment {
  id: string;
  problemId: number;
  userId: string;
  username: string;
  content: string;
  parent?: { id: string };
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  problemId: number;
  content: string;
  parentId?: string;
  userId?: string; // Will be injected by backend usually, but keeping for flexibility
  username?: string;
}
