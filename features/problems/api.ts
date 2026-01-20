// src/features/problems/api.ts
import { problemClient } from "@/lib/problemHttp";
import type {
    ApiResponse,
    Page,
    ProblemDetail,
    ProblemInput,
    ProblemListFilters,
    ProblemSummary,
} from "./types";

// Public: list problems
export async function fetchProblems(
  filters: ProblemListFilters = {}
): Promise<Page<ProblemSummary>> {
  const { page = 0, size = 10, difficulty, search } = filters;

  const response = await problemClient.get<ApiResponse<Page<ProblemSummary>>>(
    "/problems",
    {
      params: {
        page,
        size,
        difficulty,
        search,
      },
    }
  );

  return response.data.data;
}

/**
 * Searches problems using Meilisearch (via Problem Service /search endpoint)
 */
export async function searchProblems(query: string): Promise<ProblemSummary[]> {
  const response = await problemClient.get<ApiResponse<ProblemSummary[]>>(
    "/problems/search",
    {
      params: { q: query },
    }
  );
  return response.data.data;
}

// Public: get single problem by ID
export async function fetchProblemById(
  id: number
): Promise<ProblemDetail | null> {
  try {
    const response = await problemClient.get<ApiResponse<ProblemDetail>>(
      `/problems/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// Admin: create problem
export async function createProblem(
  payload: ProblemInput,
  authHeader: string
): Promise<ProblemDetail> {
  const response = await problemClient.post<ApiResponse<ProblemDetail>>(
    "/problems",
    payload,
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  return response.data.data;
}

// Admin: update problem
export async function updateProblem(
  id: number,
  payload: ProblemInput,
  authHeader: string
): Promise<ProblemDetail> {
  const response = await problemClient.put<ApiResponse<ProblemDetail>>(
    `/problems/${id}`,
    payload,
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  return response.data.data;
}

// Admin: delete problem
export async function deleteProblem(
  id: number,
  authHeader: string
): Promise<void> {
  await problemClient.delete<ApiResponse<null>>(`/problems/${id}`, {
    headers: {
      Authorization: authHeader,
    },
  });
}
