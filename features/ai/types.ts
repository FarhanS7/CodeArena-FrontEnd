export interface AiHintRequest {
  problemId: number;
  code: string;
  language: string;
}

export interface AiHintResponse {
  success: boolean;
  hint: string;
}
