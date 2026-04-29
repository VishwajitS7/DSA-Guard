"use client";

import StatsGrid from "@/components/dashboard/StatsGrid";
import { Plus, ArrowRight, Target, Brain, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";

export default function DashboardContent({ 
  session, 
  stats, 
  recentProblems 
}: { 
  session: Session; 
  stats: any; 
  recentProblems: any[] 
}) {
  return (
    <div className="space-y-10 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground mt-1">Hello, {session.user?.name}. Here is your current algorithm mastery status.</p>
        </div>
        <Link 
          href="/problems/add"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Log New Problem
        </Link>
      </div>

      {/* Stats Section */}
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card tool-border rounded-xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Recent Activity
              </h2>
              <Link href="/problems" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                View Repository <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentProblems.map((problem, i) => (
                <Link 
                  key={problem._id} 
                  href={`/problems/${problem._id}`}
                  className="block p-6 table-row-hover transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-primary transition-colors border border-border">
                        #{i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">{problem.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                          {problem.topic} • {problem.difficulty} • {new Date(problem.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pattern</span>
                      <span className="text-sm font-medium">{problem.patterns[0] || "None"}</span>
                    </div>
                  </div>
                </Link>
              ))}
              {recentProblems.length === 0 && (
                <div className="p-12 text-center text-muted-foreground italic">
                  No problems logged yet. Start by clicking "Log New Problem".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <div className="bg-card tool-border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              System Alerts
            </h2>
            <div className="space-y-4">
              {stats.revisionDue > 0 ? (
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Revision Due</p>
                  <p className="text-lg font-bold mt-1">{stats.revisionDue} Problems Queue</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Spaced repetition queue is active. Maintain your streak to ensure retention.
                  </p>
                  <Link href="/revision" className="mt-4 inline-block text-xs font-bold text-emerald-500 hover:underline uppercase tracking-widest">
                    Start Revision →
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No immediate revisions due. Great job!</p>
              )}
              
              {stats.totalSolved < 5 && (
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">System Warning</p>
                  <p className="text-lg font-bold mt-1">Insufficient Data</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Log at least 5 problems to unlock deep diagnostic insights and failure analysis.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary/5 tool-border border-primary/20 rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 opacity-5 group-hover:scale-110 transition-transform">
              <Target className="w-24 h-24 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-primary relative z-10 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Next Recommended
            </h2>
            <p className="text-sm text-muted-foreground mt-3 relative z-10 leading-relaxed">
              Log more problems to receive intelligence-based topic recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
