"use client";

import { LandingNavbar } from "@/components/layout/MainNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

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
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">
            <span>🎉</span>
            <span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                New:
              </span>{" "}
              100+ problems added this month
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Master Algorithms,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-orange-500 bg-clip-text text-transparent">
              Ace Your Interviews
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Practice coding problems, compete with developers worldwide, and
            land your dream job at top tech companies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-lg px-8 py-6"
            >
              <Link href="/signup">Start Learning Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-slate-300 dark:border-slate-700"
            >
              <Link href="/problems">Explore Problems</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                500K+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Active Developers
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                2000+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Coding Problems
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                10M+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Solutions Submitted
              </div>
            </div>
            <div>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-2">
                95%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Interview Success Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful tools and features designed to accelerate your coding
              journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Curated Problem Sets",
                description:
                  "2000+ hand-picked problems organized by topic, difficulty, and company. Practice what matters most for your goals.",
              },
              {
                icon: "⚡",
                title: "Lightning-Fast IDE",
                description:
                  "Modern code editor with syntax highlighting, autocomplete, and instant test feedback. Code like a pro.",
              },
              {
                icon: "📊",
                title: "Progress Analytics",
                description:
                  "Track your improvement with detailed statistics, heatmaps, and insights on your strengths and weaknesses.",
              },
              {
                icon: "🏆",
                title: "Competitive Contests",
                description:
                  "Join weekly contests, compete globally, and climb the leaderboards. Sharpen your skills under pressure.",
              },
              {
                icon: "💡",
                title: "Detailed Solutions",
                description:
                  "Learn from multiple approaches with video explanations, time/space complexity analysis, and community discussions.",
              },
              {
                icon: "🎓",
                title: "Interview Preparation",
                description:
                  "Company-specific questions, mock interviews, and curated study plans to prepare for FAANG interviews.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="observe opacity-0 p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-3xl mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Preview */}
      <section
        id="problems"
        className="py-24 px-6 bg-slate-50 dark:bg-slate-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
              EXPERIENCE
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Code in a Modern Environment
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Professional-grade tools that make problem-solving enjoyable
            </p>
          </div>

          <div className="observe opacity-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">Two Sum</h3>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Easy
              </span>
            </div>
            <div className="grid md:grid-cols-2">
              <div className="p-6 border-r border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-4">Description</h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  Given an array of integers{" "}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded">
                    nums
                  </code>{" "}
                  and an integer{" "}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded">
                    target
                  </code>
                  , return indices of the two numbers such that they add up to{" "}
                  <code className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded">
                    target
                  </code>
                  .
                </p>
                <h4 className="font-semibold mb-3">Example:</h4>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg font-mono text-sm">
                  <div>Input: nums = [2,7,11,15], target = 9</div>
                  <div>Output: [0,1]</div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Explanation: nums[0] + nums[1] = 9
                  </div>
                </div>
              </div>
              <div className="bg-[#1e1e1e] p-6 font-mono text-sm text-slate-200 overflow-x-auto">
                <div className="space-y-1">
                  <div>
                    <span className="text-blue-400">class</span>{" "}
                    <span className="text-yellow-300">Solution</span>:
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">def</span>{" "}
                    <span className="text-yellow-300">twoSum</span>(self, nums,
                    target):
                  </div>
                  <div className="pl-8 text-green-400"># Your code here</div>
                  <div className="pl-8">hash_map = {}</div>
                  <div className="pl-8">&nbsp;</div>
                  <div className="pl-8">
                    <span className="text-blue-400">for</span> i, num{" "}
                    <span className="text-blue-400">in</span>{" "}
                    <span className="text-yellow-300">enumerate</span>(nums):
                  </div>
                  <div className="pl-12">complement = target - num</div>
                  <div className="pl-12">&nbsp;</div>
                  <div className="pl-12">
                    <span className="text-blue-400">if</span> complement{" "}
                    <span className="text-blue-400">in</span> hash_map:
                  </div>
                  <div className="pl-16">
                    <span className="text-blue-400">return</span>{" "}
                    [hash_map[complement], i]
                  </div>
                  <div className="pl-12">&nbsp;</div>
                  <div className="pl-12">hash_map[num] = i</div>
                  <div className="pl-8">&nbsp;</div>
                  <div className="pl-8">
                    <span className="text-blue-400">return</span> []
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Start Your Journey in Minutes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A simple, proven path from beginner to interview-ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "1",
                title: "Sign Up Free",
                description:
                  "Create your account in seconds. No credit card required to start learning.",
              },
              {
                number: "2",
                title: "Choose Your Path",
                description:
                  "Select from curated learning paths based on your goals and skill level.",
              },
              {
                number: "3",
                title: "Practice Daily",
                description:
                  "Solve problems, learn patterns, and build consistency with daily challenges.",
              },
              {
                number: "4",
                title: "Ace Interviews",
                description:
                  "Apply your skills in real interviews and land your dream job.",
              },
            ].map((step, index) => (
              <div key={index} className="observe opacity-0 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-24 px-6 bg-slate-50 dark:bg-slate-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join thousands who've achieved their career goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Kim",
                role: "Software Engineer @ Google",
                avatar: "SK",
                content:
                  "CodeArena helped me land a job at Google! The problem sets are perfectly curated, and the interview prep materials are incredible. Best investment in my career.",
              },
              {
                name: "Michael Patel",
                role: "Senior Developer @ Meta",
                avatar: "MP",
                content:
                  "I went from struggling with basic algorithms to solving hard problems confidently. The progress tracking kept me motivated, and the community is amazing.",
              },
              {
                name: "Emily Lopez",
                role: "Full Stack Engineer @ Amazon",
                avatar: "EL",
                content:
                  "The weekly contests pushed me to improve faster than I thought possible. Now I'm competing at a level I never imagined. Highly recommended!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="observe opacity-0 p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl"
              >
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Ready to Level Up Your Coding Skills?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Join 500,000+ developers mastering algorithms and landing dream jobs
          </p>
          <Button
            size="lg"
            asChild
            className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-6"
          >
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  CodeArena
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                The ultimate platform for mastering algorithms, preparing for
                interviews, and advancing your software engineering career.
              </p>
              <div className="flex gap-3">
                {["𝕏", "⚡", "in", "💬"].map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {[
                  "Problems",
                  "Contests",
                  "Interview Prep",
                  "Study Plans",
                  "Pricing",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Careers", "Blog", "Press", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {[
                  "Documentation",
                  "API",
                  "Help Center",
                  "Community",
                  "Status",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <p>© 2024 CodeArena. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Terms of Service
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
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
