export type ContestStatus = "UPCOMING" | "ONGOING" | "FINISHED" | "CANCELLED";

export interface Contest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  status: ContestStatus;
  isPublic: boolean;
  participantCount: number;
  totalProblems: number;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "MIXED";
}

export interface ContestDetail extends Contest {
  problems: {
    id: number;
    title: string;
    points: number;
    order: number;
  }[];
}

export interface Participant {
  id: number;
  userId: string;
  username: string;
  contestId: number;
  startTime?: string;
  endTime?: string;
  totalScore: number;
  problemsSolved: number;
  status: "REGISTERED" | "PARTICIPATING" | "FINISHED" | "DISQUALIFIED";
}

export interface ContestLeaderboard {
  participants: {
    rank: number;
    username: string;
    totalScore: number;
    problemsSolved: number;
    finishTime?: string;
  }[];
  total: number;
}
