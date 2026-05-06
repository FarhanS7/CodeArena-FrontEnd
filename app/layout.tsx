import { DevelopmentBanner } from "@/components/common/DevelopmentBanner";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { RealtimeProvider } from "@/providers/RealtimeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Arena | Competitive Programming Platform",
  description: "Elite competitive programming platform with real-time verdicts and social integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <RealtimeProvider>
            <DevelopmentBanner />
            {children}
            <Toaster position="top-right" richColors />
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
