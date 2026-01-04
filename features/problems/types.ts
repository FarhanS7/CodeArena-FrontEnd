// src/features/problems/types.ts

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
}

export interface TestCaseInput {
  id?: number;
  input: string;
  expectedOutput: string;
}

export interface ProblemSummary {
  id: number;
  title: string;
  difficulty: Difficulty;
}

export interface ProblemDetail {
  id: number;
  title: string;
  difficulty: Difficulty;
  description: string;
  exampleInput?: string | null;
  exampleOutput?: string | null;
  testCases: TestCase[];
}

export interface ProblemInput {
  title: string;
  difficulty: Difficulty;
  description: string;
  exampleInput?: string;
  exampleOutput?: string;
  testCases: TestCaseInput[];
}

export interface Page<T> {
  content: T[];
  pageable: unknown;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: unknown;
}

export interface ProblemListFilters {
  page?: number;
  size?: number;
  difficulty?: Difficulty;
  search?: string;
}
