import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { Target, CheckCircle2, Calendar, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";
import RevisedButton from "@/components/revision/RevisedButton";

export const dynamic = "force-dynamic";

export default async function RevisionPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Brain className="w-16 h-16 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">Sign in to view revisions</h2>
      </div>
    );
  }

  await connectDB();
  const today = new Date();
  const dueProblems = await Problem.find({
    user: (session.user as any).id,
    nextRevision: { $lte: today }
  }).sort({ nextRevision: 1 });

  return (
    <div className="space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revision Queue</h1>
          <p className="text-muted-foreground mt-1">Found {dueProblems.length} problems requiring recall verification today.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded text-primary text-xs font-bold uppercase tracking-widest">
          <Target className="w-4 h-4" />
          Spaced Repetition Active
        </div>
      </div>

      {dueProblems.length === 0 ? (
        <div className="bg-card tool-border rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">System Status: Optimal</h2>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">All recall targets have been met. No problems are currently due for revision.</p>
          </div>
          <Link href="/problems" className="inline-flex items-center gap-2 text-primary font-bold hover:underline uppercase tracking-widest text-xs">
            Browse Repository <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {dueProblems.map((problem) => (
            <div key={problem._id.toString()} className="bg-card tool-border rounded-xl overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded border ${
                      problem.difficulty === 'Easy' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
                      problem.difficulty === 'Medium' ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' :
                      'bg-red-500/5 text-red-500 border-red-500/20'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{problem.topic}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    Recall Due
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{problem.title}</h3>
                
                <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Core Intelligence Insight</p>
                  <p className="text-lg leading-relaxed italic font-medium">&quot;{problem.keyInsight}&quot;</p>
                </div>
              </div>

              <div className="w-full md:w-64 bg-muted/20 border-t md:border-t-0 md:border-l border-border p-8 flex flex-col justify-center gap-4">
                <a 
                  href={problem.link} 
                  target="_blank" 
                  className="w-full py-3 border border-border bg-background hover:bg-muted text-center rounded text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Verify Solution
                </a>
                <RevisedButton problemId={problem._id.toString()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
