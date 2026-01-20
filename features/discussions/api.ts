import { discussionClient } from "@/lib/discussionHttp";
import { Comment, CreateCommentDto } from "./types";

export async function fetchComments(problemId: number): Promise<Comment[]> {
  const response = await discussionClient.get<Comment[]>(`/discussions/problem/${problemId}`);
  return response.data;
}

export async function createComment(dto: CreateCommentDto): Promise<Comment> {
  const response = await discussionClient.post<Comment>("/discussions", dto);
  return response.data;
}

export async function deleteComment(id: string): Promise<void> {
  await discussionClient.delete(`/discussions/${id}`);
}
