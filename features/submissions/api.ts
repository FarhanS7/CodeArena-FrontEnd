import axios from "axios";
import type { CreateSubmissionDto, Submission, UserStats } from "./types";

const API_URL = process.env.NEXT_PUBLIC_EXECUTION_SERVICE_URL || "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function createSubmission(dto: CreateSubmissionDto): Promise<Submission> {
  const response = await api.post("/submissions", dto);
  return response.data.data;
}

export async function fetchSubmissionById(id: number): Promise<Submission> {
  const response = await api.get(`/submissions/${id}`);
  return response.data.data;
}

export async function fetchUserSubmissions(userId: number): Promise<Submission[]> {
  const response = await api.get(`/submissions/user/${userId}`);
  return response.data.data;
}

export async function fetchUserStats(userId: number): Promise<UserStats> {
  const response = await api.get(`/submissions/user/${userId}/stats`);
  return response.data.data;
}

export async function fetchProblemSubmissions(problemId: number): Promise<Submission[]> {
  const response = await api.get(`/submissions/problem/${problemId}`);
  return response.data.data;
}
