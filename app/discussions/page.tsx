import { GlobalDiscussionPage } from "@/components/discussions/GlobalDiscussionPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discussions | Code Arena Nexus",
  description: "Join the conversation and learn from top engineers across the Code Arena community.",
};

export default function Page() {
  return <GlobalDiscussionPage />;
}
