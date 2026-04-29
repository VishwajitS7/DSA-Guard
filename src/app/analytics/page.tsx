import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { PieChart, BarChart, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div className="p-20 text-center">Authentication Required</div>;
  }

  await connectDB();
  const problems = await Problem.find({ user: (session.user as any).id });

  // Topic distribution
  const topicStats: Record<string, number> = {};
  const mistakes: Record<string, number> = {};
  
  problems.forEach(p => {
    topicStats[p.topic] = (topicStats[p.topic] || 0) + 1;
    p.mistakes.forEach((m: string) => {
      mistakes[m] = (mistakes[m] || 0) + 1;
    });
  });

  const sortedTopics = Object.entries(topicStats).sort((a, b) => b[1] - a[1]);
  const sortedMistakes = Object.entries(mistakes).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-10 animate-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Diagnostic breakdown of your problem-solving intelligence.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded px-3 py-1.5 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <PieChart className="w-4 h-4" />
          Full Diagnostic Report
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Topic Distribution */}
        <div className="bg-card tool-border rounded-xl p-8 space-y-8">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4">
            <BarChart className="w-5 h-5 text-primary" />
            Topic Saturation
          </h2>
          <div className="space-y-6">
            {sortedTopics.slice(0, 8).map(([topic, count]) => {
              const percentage = (count / problems.length) * 100;
              return (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>{topic}</span>
                    <span>{count} Problems ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/50">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mistake Trends */}
        <div className="bg-card tool-border rounded-xl p-8 space-y-8">
          <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            System Failure Points
          </h2>
          <div className="space-y-6">
            {sortedMistakes.slice(0, 8).map(([mistake, count]) => {
              const maxMistakes = Math.max(...Object.values(mistakes));
              const percentage = (count / maxMistakes) * 100;
              return (
                <div key={mistake} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-red-400">{mistake}</span>
                    <span className="text-muted-foreground">{count} Failures</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/50">
                    <div 
                      className="bg-red-500/60 h-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {sortedMistakes.length === 0 && (
              <p className="text-center py-20 text-muted-foreground italic text-sm">No failure data recorded in system logs.</p>
            )}
          </div>
        </div>
      </div>

      {/* Intelligence Summary */}
      <div className="bg-primary/5 tool-border border-primary/20 rounded-xl p-10 text-center space-y-6">
        <ShieldCheck className="w-12 h-12 text-primary mx-auto opacity-50" />
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Diagnostic Conclusion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 bg-background/50 border border-border rounded-lg">
              <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-[0.15em] text-[10px] mb-2">
                <TrendingUp className="w-3.5 h-3.5" /> Core Strength
              </div>
              <p className="text-sm font-medium leading-relaxed">
                Your highest saturation is in <span className="text-emerald-500 font-bold">{sortedTopics[0]?.[0] || "N/A"}</span>. Maintain current practice frequency to stabilize mastery.
              </p>
            </div>
            <div className="p-6 bg-background/50 border border-border rounded-lg">
              <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-[0.15em] text-[10px] mb-2">
                <TrendingDown className="w-3.5 h-3.5" /> Recall Risk
              </div>
              <p className="text-sm font-medium leading-relaxed">
                The most frequent failure point is <span className="text-amber-500 font-bold">{sortedMistakes[0]?.[0] || "N/A"}</span>. Implement focused drills to mitigate this risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
