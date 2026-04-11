import axios from "axios";
import { 
    Contest, 
    ContestDetail, 
    ContestLeaderboard, 
    Participant 
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_CONTEST_SERVICE_URL || "http://localhost:8082/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function fetchContests(status?: string): Promise<{ contests: Contest[], total: number }> {
  const response = await api.get("/contests", { params: { status } });
  return response.data;
}

export async function fetchContestById(id: number): Promise<ContestDetail> {
  const response = await api.get(`/contests/${id}`);
  return response.data;
}

export async function registerForContest(id: number): Promise<void> {
  await api.post(`/contests/${id}/register`);
}

export async function startContest(id: number): Promise<void> {
  await api.post(`/contests/${id}/start`);
}

export async function fetchContestLeaderboard(id: number): Promise<ContestLeaderboard> {
  const response = await api.get(`/contests/${id}/leaderboard`);
  return response.data;
}

export async function fetchUserParticipation(id: number): Promise<{ isRegistered: boolean; participation: Participant | null }> {
  const response = await api.get(`/contests/${id}/participation`);
  return response.data;
}

export async function fetchContestAnalytics(id: number): Promise<any> {
    const response = await api.get(`/contests/${id}/analytics`);
    return response.data;
}

export async function createContest(data: Partial<Contest>): Promise<Contest> {
  const response = await api.post("/contests", data);
  return response.data;
}

export async function updateContest(id: number, data: Partial<Contest>): Promise<Contest> {
  const response = await api.put(`/contests/${id}`, data);
  return response.data;
}

export async function deleteContest(id: number): Promise<void> {
  await api.delete(`/contests/${id}`);
}

export async function addProblemToContest(contestId: number, problemId: number, points: number, order: number): Promise<void> {
  await api.post(`/contests/${contestId}/problems`, { problemId, points, order });
}

export async function removeProblemFromContest(contestId: number, problemId: number): Promise<void> {
  await api.delete(`/contests/${contestId}/problems/${problemId}`);
}
