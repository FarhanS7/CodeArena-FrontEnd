import { LeaderboardPage } from "@/components/leaderboard/LeaderboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | Code Arena",
  description: "Global rankings and top performers in Code Arena.",
};

export default function Page() {
  return <LeaderboardPage />;
}
