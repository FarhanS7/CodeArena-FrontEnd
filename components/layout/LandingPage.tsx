"use client";

import { LandingNavbar } from "@/components/layout/MainNavbar";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#080B10] text-slate-900 dark:text-slate-100 selection:bg-blue-500/20">
      {/* Technical Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-blue-600 opacity-20 blur-[120px]"
        />
        <div className="absolute top-1/2 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-violet-600 opacity-10 blur-[100px]" />
      </div>

      <LandingNavbar />

      {/* Hero Section */}
      <section ref={targetRef} className="relative pt-40 pb-32 px-6 z-10 overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-7xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-300 mb-10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>New: Advanced System Design Tracks</span>
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
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 leading-[1]"
          >
            Elevate Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-indigo-400 bg-clip-text text-transparent pb-4">
              Coding Prowess
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            The premium platform for engineers who don't settle. Master algorithms, 
            dominate contests, and scale your career.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              size="lg"
              asChild
              className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(37,99,235,0.6)] transition-all duration-300 hover:-translate-y-1"
            >
              <Link href="/signup">Join the Elite</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-10 text-lg rounded-full border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 dark:text-slate-300 backdrop-blur-sm"
            >
              <Link href="/problems">Review Catalog</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar (Glassmorphism) */}
      <section className="py-16 border-y border-slate-200 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02] backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Active Developers", value: "850K+" },
              { label: "Elite Problems", value: "3200+" },
              { label: "Solutions Evaluated", value: "25M+" },
              { label: "Placement Rate", value: "98%" },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (Premium Grid) */}
      <section id="features" className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold mb-8"
            >
              Engineered for Excellence
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Every tool is meticulously crafted to accelerate your growth 
              and sharpen your technical edge.
            </motion.p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Architectural Patterns",
                desc: "Deep dives into system design and scalable infrastructure patterns used by industry giants.",
                color: "blue",
              },
              {
                title: "Real-time Distributed IDE",
                desc: "Collaborate instantly on complex problems with our low-latency cloud environment.",
                color: "violet",
              },
              {
                title: "Cognitive Analytics",
                desc: "AI-driven insights that identify your performance bottlenecks and learning gaps.",
                color: "indigo",
              },
              {
                title: "High-Stakes Contests",
                desc: "Battle top-tier engineers in time-pressured environments for global recognition.",
                color: "amber",
              },
              {
                title: "Algorithmic Blueprints",
                desc: "Exhaustive solutions with interactive visualizations of time and space complexity.",
                color: "rose",
              },
              {
                title: "FAANG Simulation",
                desc: "Mirror the exact interview conditions and questions of Tier-1 tech companies.",
                color: "cyan",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group p-10 bg-white dark:bg-[#0C1017] border border-slate-200 dark:border-white/5 rounded-3xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.15)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 dark:bg-${feature.color}-500/10 flex items-center justify-center mb-8 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:rotate-12 transition-transform duration-500`}>
                  <Icons.Zap />
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10 text-lg">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Preview (The "IDE" Look) */}
      <section
        id="problems"
        className="py-32 px-6 bg-slate-50 dark:bg-[#080B10] relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl text-left">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 tracking-wider"
              >
                THE ENVIRONMENT
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Sophisticated Tooling.
                <br />
                Zero Friction.
              </h2>
            </div>
            <Button
              variant="outline"
              className="h-12 px-8 rounded-full border-slate-300 dark:border-white/10 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-base"
            >
              Enter Sandbox
            </Button>
          </div>

          {/* IDE Container */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121212] ring-1 ring-white/5"
          >
            {/* IDE Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-100/50 dark:bg-[#1A1A1A] border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-inner" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-inner" />
              </div>
              <div className="text-sm font-mono text-slate-500 flex items-center gap-2">
                <Icons.Code />
                <span className="mb-0.5">optimal_path.py — CodeArena Elite</span>
              </div>
              <div className="w-16" />
            </div>

            <div className="grid lg:grid-cols-5 h-[600px]">
              {/* Problem Description Panel */}
              <div className="lg:col-span-2 p-10 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0C1017] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-3xl font-bold">146. LRU Cache</h3>
                  <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                    Medium
                  </span>
                </div>

                <div className="prose dark:prose-invert max-w-none text-lg">
                  <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    Design a data structure that follows the constraints of a{" "}
                    <span className="text-blue-500 font-bold">Least Recently Used (LRU)</span> cache.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                      <p className="text-slate-500 dark:text-slate-400">Initialize the cache with positive capacity.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                      <p className="text-slate-500 dark:text-slate-400">Get key value if it exists, otherwise return -1.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                      <p className="text-slate-500 dark:text-slate-400">Update value if key exists; otherwise add key-value pair.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Editor Panel */}
              <div className="lg:col-span-3 bg-[#0D0D0D] p-10 font-mono text-base leading-relaxed overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                  <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-500">Python 3.12</div>
                </div>
                <div className="flex h-full">
                  <div className="flex flex-col text-right pr-6 text-[#333] select-none border-r border-white/5 mr-6 font-light">
                    {Array.from({length: 18}).map((_, i) => (
                        <span key={i} className="leading-7">{i + 1}</span>
                    ))}
                  </div>
                  <div className="w-full">
                    <div className="leading-7"><span className="text-blue-400 italic">class</span> <span className="text-emerald-400 font-semibold">LRUCache</span>:</div>
                    <div className="pl-6 leading-7"><span className="text-blue-400 italic">def</span> <span className="text-amber-300">__init__</span>(self, capacity: <span className="text-emerald-400">int</span>):</div>
                    <div className="pl-12 leading-7 text-slate-600"># Use OrderedDict for LRU behavior</div>
                    <div className="pl-12 leading-7">self.cap = capacity</div>
                    <div className="pl-12 leading-7">self.cache = OrderedDict()</div>
                    <div className="pl-6 leading-7">&nbsp;</div>
                    <div className="pl-6 leading-7"><span className="text-blue-400 italic">def</span> <span className="text-amber-300">get</span>(self, key: <span className="text-emerald-400">int</span>) -&gt; <span className="text-emerald-400">int</span>:</div>
                    <div className="pl-12 leading-7"><span className="text-purple-400">if</span> key <span className="text-purple-400">not in</span> self.cache:</div>
                    <div className="pl-18 leading-7"><span className="text-purple-400">return</span> -<span className="text-orange-400">1</span></div>
                    <div className="pl-12 leading-7">self.cache.move_to_end(key)</div>
                    <div className="pl-12 leading-7"><span className="text-purple-400">return</span> self.cache[key]</div>
                    <div className="mt-8 flex items-center gap-2">
                       <div className="w-2 h-5 bg-blue-500 animate-pulse" />
                       <span className="text-blue-500/50 italic text-sm">Ready to compile...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-40 px-6 bg-white dark:bg-[#080B10] border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Trusted by the Best</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Alex Rivera",
                role: "Senior Engineer @ Netflix",
                text: "The aesthetic and the tooling of CodeArena are unparalleled. It's built for professionals.",
                color: "from-blue-500 to-indigo-500"
              },
              {
                name: "Jordan Wu",
                role: "Staff SWE @ Stripe",
                text: "The system design modules changed how I approach distributed systems entirely.",
                color: "from-violet-500 to-fuchsia-500"
              },
              {
                name: "Sriya Rao",
                role: "Core Dev @ Apple",
                text: "Weekly contests are brutal but rewarding. The quality of problems is tier-1.",
                color: "from-emerald-500 to-teal-500"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-[#0C1017] border border-slate-200 dark:border-white/10 group hover:bg-white dark:hover:bg-[#121821] transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-full mb-8 bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-xl ring-8 ring-white dark:ring-white/[0.03]`}>
                  {t.name[0]}
                </div>
                <p className="text-xl text-slate-700 dark:text-slate-300 italic mb-10 leading-relaxed group-hover:dark:text-white transition-colors">
                  "{t.text}"
                </p>
                <div>
                  <div className="font-bold text-lg">{t.name}</div>
                  <div className="text-sm text-slate-500 uppercase tracking-widest">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#080B10]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-violet-600/30" />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[80%] h-[150%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" 
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-bold text-white mb-10 tracking-tight"
          >
            Ready to Lead?
          </motion.h2>
          <p className="text-2xl text-blue-100/70 mb-16 max-w-2xl mx-auto">
            Secure your spot in the next global cohort and start your journey to technical mastery.
          </p>
          <Button
            size="lg"
            asChild
            className="h-16 px-16 text-xl bg-white text-blue-600 hover:bg-blue-50 rounded-full font-bold shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300"
          >
            <Link href="/signup">Claim Your Access</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-[#080B10] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-20 mb-20 text-slate-400">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-10 group">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                  <Icons.Zap />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">CodeArena.</span>
              </Link>
              <p className="text-lg max-w-md leading-relaxed">
                Empowering the next generation of top-tier engineers with the world's most sophisticated 
                algorithmic learning environment.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/problems" className="hover:text-blue-400 transition-colors">Elite Problem Set</Link></li>
                <li><Link href="/contests" className="hover:text-blue-400 transition-colors">Global Contests</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Membership</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 font-medium">
            <p>© 2024 CodeArena Technologies Inc. All rights reserved.</p>
            <div className="flex gap-10">
               <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
               <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
               <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.2);
        }
        
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .floating {
          animation: subtle-float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
