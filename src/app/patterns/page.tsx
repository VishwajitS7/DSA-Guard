import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { BrainCircuit, BookOpen, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PatternsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <BrainCircuit className="w-16 h-16 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">Sign in to view patterns</h2>
      </div>
    );
  }

  await connectDB();
  const problems = await Problem.find({ user: (session.user as any).id });

  // Group problems by patterns
  const patternStats: Record<string, { count: number; problems: any[] }> = {};
  
  problems.forEach(p => {
    p.patterns.forEach((pattern: string) => {
      if (!patternStats[pattern]) {
        patternStats[pattern] = { count: 0, problems: [] };
      }
      patternStats[pattern].count++;
      patternStats[pattern].problems.push(p);
    });
  });

  const sortedPatterns = Object.entries(patternStats).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pattern Intelligence</h1>
          <p className="text-muted-foreground mt-1">Cross-referencing {sortedPatterns.length} unique algorithmic patterns in your repository.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded px-3 py-1.5 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <BrainCircuit className="w-4 h-4" />
          Recognition System Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPatterns.map(([name, data]) => {
          const mastery = Math.min(data.count * 10, 100);
          return (
            <div key={name} className="bg-card tool-border rounded-xl p-8 flex flex-col justify-between hover:border-primary transition-all group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-muted p-2.5 rounded border border-border group-hover:border-primary/50 group-hover:text-primary transition-all">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    {data.count} Instances
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold tracking-tight mb-6 group-hover:text-primary transition-colors">{name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> System Mastery
                    </span>
                    <span>{mastery}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-700" 
                      style={{ width: `${mastery}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Recent problem IDs</p>
                <div className="space-y-2.5">
                  {data.problems.slice(0, 3).map((p, i) => (
                    <Link 
                      key={i} 
                      href={`/problems/${p._id}`}
                      className="flex items-center gap-3 text-xs text-muted-foreground hover:text-primary transition-colors group/item"
                    >
                      <BookOpen className="w-3.5 h-3.5 opacity-50" />
                      <span className="truncate flex-1">{p.title}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {sortedPatterns.length === 0 && (
          <div className="col-span-full py-24 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p className="font-bold uppercase tracking-widest text-xs">No Patterns Detected</p>
            <p className="mt-2 text-sm italic">Pattern recognition requires at least one problem record with tagged metadata.</p>
            <Link href="/problems/add" className="mt-6 inline-block text-primary font-bold hover:underline text-xs uppercase tracking-widest">
              Add Metadata →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
