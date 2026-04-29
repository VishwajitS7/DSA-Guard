"use client";

import { signIn } from "next-auth/react";
import { 
  ShieldCheck, 
  ChevronRight, 
  Terminal, 
  Brain, 
  BarChart, 
  Target,
  Search,
  Zap,
  Repeat
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-10 shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            Optimized for Interview Readiness
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold heading-tight mb-8 text-slate-900">
            Master Algorithms through <br />
            <span className="text-primary">Cognitive Structure</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            DSA Guardian isn't just a tracker. It's a structured learning system that helps you categorize logic, analyze failures, and retain complex patterns forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={() => signIn("google")}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              Get Started for Free
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
            >
              Read the Philosophy
            </button>
          </div>
        </div>
      </section>

      {/* Specific Information Section */}
      <section id="features" className="py-24 px-6 border-y border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Deep Learning Features</h2>
            <p className="text-slate-500">Engineered for long-term retention and pattern recognition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Spaced Repetition (SRS)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automatically schedules revisions at <strong>1, 3, 7, 30, and 90-day</strong> intervals. Our system ensures you revisit problems exactly when your memory starts to fade.
              </p>
            </div>

            <div className="space-y-4 p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Pattern Mapping</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Map problems to high-level logic like <strong>Sliding Window</strong>, <strong>Two Pointers</strong>, or <strong>In-place Reversal</strong>. Build intuition for *why* a solution works, not just *how*.
              </p>
            </div>

            <div className="space-y-4 p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Failure Diagnostics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track <strong>Edge Case Misses</strong>, <strong>Complexity Errors</strong>, and <strong>Logic Gaps</strong>. Our analytics engine identifies exactly where your problem-solving process is failing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-24 h-4 bg-slate-100 rounded"></div>
                  <div className="w-12 h-4 bg-emerald-100 rounded"></div>
                </div>
                <div className="h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center px-4 gap-3 text-slate-400">
                  <Search className="w-4 h-4" />
                  <span className="text-xs">Search Patterns...</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 border-2 border-primary/20 bg-primary/5 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Target className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Revision Due</span>
                  </div>
                  <div className="h-32 border border-slate-100 bg-white rounded-2xl p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <BarChart className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mastery 85%</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Insight</span>
                  </div>
                  <p className="text-xs italic text-slate-300 leading-relaxed">
                    "Pattern recognition failed due to unhandled XOR edge case in bit manipulation..."
                  </p>
                </div>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</p>
                <p className="text-sm font-bold text-slate-900">All logic verified</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">The "AHA!" Moment <br /><span className="text-primary text-3xl">Captured Forever.</span></h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We focus on the cognitive science of learning. DSA Guardian forces you to slow down and document the <strong>Core Intelligence</strong> of every problem.
            </p>
            <div className="space-y-6">
              {[
                { title: "Structured Categorization", desc: "Topic → Sub-topic → Pattern → Complexity." },
                { title: "Recall Verification", desc: "Don't just re-solve; verify if you remember the 'Why'." },
                { title: "Pattern Mastery", desc: "Watch your intuition grow as pattern counts increase." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">The Guardian Workflow</h2>
            <p className="text-slate-500">Four specific steps to absolute algorithm mastery.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Solve", desc: "Solve problems on your favorite platform (LeetCode, GFG, etc)." },
              { icon: Repeat, title: "Log", desc: "Record the solution metadata and your primary approach." },
              { icon: Brain, title: "Insight", desc: "Extract the core logic and map it to a specific pattern." },
              { icon: Target, title: "Revise", desc: "Use the SRS queue to verify your recall at optimal intervals." }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  <step.icon className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-slate-200 bg-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-8 heading-tight">Start Building Your <br /> Algorithmic Intuition.</h2>
          <p className="text-xl text-slate-600 mb-12">No more memorization. Start thinking like a senior engineer.</p>
          <button 
            onClick={() => signIn("google")}
            className="px-12 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-xl hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl shadow-primary/20"
          >
            Create Your Guardian Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 text-center text-slate-400 text-sm bg-white">
        <div className="flex items-center justify-center gap-2 mb-4 font-bold text-slate-900">
          <ShieldCheck className="w-6 h-6 text-primary" />
          DSA GUARDIAN
        </div>
        <p>© 2026 DSA Guardian Platform. Built for serious mastery.</p>
      </footer>
    </div>
  );
}
