import axios from "axios";
import { env } from "@/config/env";

const API_URL = env.PROBLEM_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface AdminProblem {
  id: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  description: string;
  exampleInput?: string;
  exampleOutput?: string;
  testCases?: {
    id?: number;
    input: string;
    expectedOutput: string;
  }[];
}

export async function fetchAdminProblems(page = 0, size = 100): Promise<{ content: AdminProblem[], totalElements: number }> {
    // Note: The Spring Boot controller returns an ApiResponse which contains the Page object in 'data'
    const response = await api.get("/problems", { params: { page, size } });
    return response.data.data;
}

export async function fetchAdminProblemById(id: number): Promise<AdminProblem> {
    const response = await api.get(`/problems/${id}`);
    return response.data.data;
}

export async function createAdminProblem(data: any): Promise<AdminProblem> {
    const response = await api.post("/problems", data);
    return response.data.data;
}

export async function updateAdminProblem(id: number, data: any): Promise<AdminProblem> {
    const response = await api.put(`/problems/${id}`, data);
    return response.data.data;
}

export async function deleteAdminProblem(id: number): Promise<void> {
    await api.delete(`/problems/${id}`);
}
