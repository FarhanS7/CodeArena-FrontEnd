export interface Submission {
  id: string;
  problemId: number;
  problemTitle: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'COMPILATION_ERROR' | 'RUNTIME_ERROR' | 'PARTIAL' | 'PENDING';
  language: string;
  submittedAt: string;
  score: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  code?: string;
  verdict?: {
    runtime: number;
    memory: number;
    runtimePercent: number;
    memoryPercent: number;
  };
  testResults?: Array<{
    testCase: number;
    expected: string;
    actual: string;
    status: 'PASS' | 'FAIL';
    stderr: string;
  }>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: string;
}
