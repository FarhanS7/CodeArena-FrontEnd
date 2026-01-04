"use client";

import { LandingNavbar } from "@/components/layout/MainNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

// Helper for Icons (Solar Style)
const Icons = {
  Code: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.5" />
      <path
        d="M8 12L16 12M16 12L13 9M16 12L13 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Trophy: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-6 h-6"
    >
      <path
        d="M14.272 10.445L18 2m-8.68 8.445L6 2m8.272 8.445h-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21a6 6 0 006-6c0-2.22-1.206-4.16-3-5.228M6 21a6 6 0 01-6-6c0-2.22 1.206-4.16 3-5.228"
        strokeOpacity="0.5"
      />
    </svg>
  ),
  Zap: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="w-6 h-6"
    >
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default function LandingPage() {
  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".observe").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0E14] text-slate-900 dark:text-slate-100 selection:bg-blue-500/20">
      {/* Technical Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
      </div>

      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-300 mb-8 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>New: 100+ problems added this month</span>
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
            Master Algorithms,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-indigo-400 bg-clip-text text-transparent pb-2">
              Ace Your Interviews
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join the elite community of developers. Practice coding problems,
            compete in global contests, and land your dream job at top tech
            companies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              asChild
              className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)] transition-all duration-300 hover:-translate-y-1"
            >
              <Link href="/signup">Start Learning Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 px-8 text-base rounded-full border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 dark:text-slate-300"
            >
              <Link href="/problems">Explore Problems</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar (Glassmorphism) */}
      <section className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0B0E14]/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200 dark:divide-white/5">
            {[
              { label: "Active Developers", value: "500K+" },
              { label: "Coding Problems", value: "2000+" },
              { label: "Solutions Submitted", value: "10M+" },
              { label: "Success Rate", value: "95%" },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-500 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools designed for the modern software engineer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Curated Problem Sets",
                desc: "Hand-picked problems organized by topic and company.",
                color: "blue",
              },
              {
                title: "Lightning-Fast IDE",
                desc: "Modern editor with syntax highlighting and instant feedback.",
                color: "violet",
              },
              {
                title: "Progress Analytics",
                desc: "Track improvement with detailed heatmaps and insights.",
                color: "emerald",
              },
              {
                title: "Competitive Contests",
                desc: "Join weekly contests and climb the global leaderboards.",
                color: "amber",
              },
              {
                title: "Detailed Solutions",
                desc: "Video explanations and time/space complexity analysis.",
                color: "rose",
              },
              {
                title: "Interview Preparation",
                desc: "Mock interviews and curated plans for FAANG roles.",
                color: "cyan",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="observe opacity-0 group p-8 bg-white dark:bg-[#0F1219] border border-slate-200 dark:border-white/5 rounded-2xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 relative overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div
                  className={`w-12 h-12 rounded-lg bg-${feature.color}-50 dark:bg-${feature.color}-500/10 flex items-center justify-center mb-6 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icons.Zap />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Preview (The "IDE" Look) */}
      <section
        id="problems"
        className="py-24 px-6 bg-slate-50 dark:bg-[#0B0E14] relative overflow-hidden"
      >
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                EXPERIENCE
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Code in a Modern Environment
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Professional-grade tools that make problem-solving intuitive and
                fast.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-slate-300 dark:border-white/10 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              View All Problems
            </Button>
          </div>

          {/* IDE Container */}
          <div className="observe opacity-0 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e1e1e] ring-1 ring-white/5">
            {/* IDE Header (MacOS Style) */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-[#252526] border-b border-slate-200 dark:border-[#1e1e1e]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-xs font-mono text-slate-500">
                solution.py — CodeArena
              </div>
              <div className="w-16" /> {/* Spacer for centering */}
            </div>

            <div className="grid md:grid-cols-2 min-h-[500px]">
              {/* Problem Description Panel */}
              <div className="p-8 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0F1219]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">1. Two Sum</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                    Easy
                  </span>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Given an array of integers{" "}
                    <code className="text-sm bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-pink-500">
                      nums
                    </code>{" "}
                    and an integer{" "}
                    <code className="text-sm bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-pink-500">
                      target
                    </code>
                    , return indices of the two numbers such that they add up to{" "}
                    <code className="text-sm bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-pink-500">
                      target
                    </code>
                    .
                  </p>

                  <div className="bg-slate-50 dark:bg-[#161b22] p-4 rounded-lg border border-slate-200 dark:border-white/5 mb-6">
                    <p className="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-200">
                      Example 1:
                    </p>
                    <div className="font-mono text-sm space-y-1">
                      <div>
                        <span className="text-slate-500">Input:</span> nums =
                        [2,7,11,15], target = 9
                      </div>
                      <div>
                        <span className="text-slate-500">Output:</span> [0,1]
                      </div>
                      <div>
                        <span className="text-slate-500">Explanation:</span>{" "}
                        nums[0] + nums[1] == 9
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Editor Panel */}
              <div className="bg-[#1e1e1e] p-6 font-mono text-sm leading-relaxed overflow-x-auto text-[#d4d4d4]">
                <div className="flex">
                  <div className="flex flex-col text-right pr-4 text-[#858585] select-none border-r border-[#404040] mr-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                      (n) => (
                        <span key={n}>{n}</span>
                      )
                    )}
                  </div>
                  <div className="w-full">
                    <div>
                      <span className="text-[#569CD6]">class</span>{" "}
                      <span className="text-[#4EC9B0]">Solution</span>:
                    </div>
                    <div className="pl-4">
                      <span className="text-[#569CD6]">def</span>{" "}
                      <span className="text-[#DCDCAA]">twoSum</span>(self, nums:
                      List[<span className="text-[#4EC9B0]">int</span>], target:{" "}
                      <span className="text-[#4EC9B0]">int</span>) -&gt; List[
                      <span className="text-[#4EC9B0]">int</span>]:
                    </div>
                    <div className="pl-8 text-[#6A9955]">
                      # Initialize hash map to store values
                    </div>
                    <div className="pl-8">hash_map = {}</div>
                    <div className="pl-8">&nbsp;</div>
                    <div className="pl-8">
                      <span className="text-[#C586C0]">for</span> i, num{" "}
                      <span className="text-[#C586C0]">in</span>{" "}
                      <span className="text-[#DCDCAA]">enumerate</span>(nums):
                    </div>
                    <div className="pl-12">complement = target - num</div>
                    <div className="pl-12">&nbsp;</div>
                    <div className="pl-12">
                      <span className="text-[#C586C0]">if</span> complement{" "}
                      <span className="text-[#C586C0]">in</span> hash_map:
                    </div>
                    <div className="pl-16">
                      <span className="text-[#C586C0]">return</span>{" "}
                      [hash_map[complement], i]
                    </div>
                    <div className="pl-12">&nbsp;</div>
                    <div className="pl-12">hash_map[num] = i</div>
                    <div className="pl-8">&nbsp;</div>
                    <div className="pl-8">
                      <span className="text-[#C586C0]">return</span> []
                    </div>
                    <div className="mt-8 animate-pulse text-blue-400">|</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Start Your Journey
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Sign Up",
                desc: "Create your free account.",
              },
              {
                num: "02",
                title: "Select Path",
                desc: "Choose your learning track.",
              },
              { num: "03", title: "Practice", desc: "Solve daily challenges." },
              { num: "04", title: "Succeed", desc: "Land your dream job." },
            ].map((step, index) => (
              <div key={index} className="observe opacity-0 relative group">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-100 dark:bg-white/5 rounded-2xl transform transition-transform group-hover:rotate-2"></div>
                <div className="relative p-8 bg-white dark:bg-[#0F1219] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-5xl font-bold text-slate-100 dark:text-white/5 mb-4 absolute top-4 right-4">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 relative z-10">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-24 px-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0B0E14]/50"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Loved by Developers
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Kim",
                role: "Software Engineer @ Google",
                initial: "S",
                color: "bg-red-500",
                text: "CodeArena helped me land a job at Google! The problem sets are perfectly curated.",
              },
              {
                name: "Michael Patel",
                role: "Senior Developer @ Meta",
                initial: "M",
                color: "bg-blue-500",
                text: "I went from struggling with basic algorithms to solving hard problems confidently.",
              },
              {
                name: "Emily Lopez",
                role: "Full Stack @ Amazon",
                initial: "E",
                color: "bg-yellow-500",
                text: "The weekly contests pushed me to improve faster than I thought possible.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="observe opacity-0 p-8 bg-white dark:bg-[#0F1219] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold`}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-800 -z-10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Ready to Level Up?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join 500,000+ developers mastering algorithms today.
          </p>
          <Button
            size="lg"
            asChild
            className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-slate-100 rounded-full font-semibold shadow-2xl"
          >
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#0B0E14]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">CodeArena</span>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
                The ultimate platform for mastering algorithms, preparing for
                interviews, and advancing your career.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Problems
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Contests
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2024 CodeArena. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-slate-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-slate-900 dark:hover:text-slate-300"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
