export type SubmissionStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "RUNTIME_ERROR"
  | "COMPILATION_ERROR"
  | "INTERNAL_ERROR";

export interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  time: number;
  memory: number;
  error?: string;
}

export interface Submission {
  id: number;
  userId: string;
  problemId: number;
  language: string;
  sourceCode: string;
  status: SubmissionStatus;
  executionTime?: number;
  memoryUsed?: number;
  testCasesPassed: number;
  totalTestCases: number;
  errorMessage?: string;
  testResults?: TestResult[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubmissionDto {
  userId: string;
  problemId: number;
  language: string;
  sourceCode: string;
}

export interface UserStats {
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
}
