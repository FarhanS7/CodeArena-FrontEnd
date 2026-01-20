import { env } from "@/config/env";
import axios from "axios";

export interface RankingItem {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: RankingItem[];
}

export async function fetchGlobalLeaderboard(limit: number = 20): Promise<RankingItem[]> {
  const response = await axios.get<LeaderboardResponse>(`${env.LEADERBOARD_BASE_URL}/leaderboard/global?limit=${limit}`);
  return response.data.data;
}
