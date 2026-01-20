import { aiClient } from "@/lib/aiHttp";
import { AiHintRequest, AiHintResponse } from "./types";

export async function fetchAiHint(payload: AiHintRequest): Promise<string> {
  const response = await aiClient.post<AiHintResponse>("/ai/hint", payload);
  return response.data.hint;
}
