import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { 
  ChevronLeft, 
  ExternalLink, 
  Clock, 
  Database, 
  Lightbulb, 
  MessageSquare, 
  AlertCircle,
  FileCode
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SimilarProblems from "@/components/problems/SimilarProblems";

export const dynamic = "force-dynamic";

export default async function ProblemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div className="p-20 text-center">Authentication Required</div>;
  }

  await connectDB();
  const problem = await Problem.findOne({ 
    _id: id, 
    user: (session.user as any).id 
  });

  if (!problem) {
    return notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <Link 
          href="/problems" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Repository
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status: Mastered</span>
          <a 
            href={problem.link} 
            target="_blank" 
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded transition-all text-xs font-bold uppercase tracking-widest"
          >
            Source Platform
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hero Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded border ${
            problem.difficulty === 'Easy' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
            problem.difficulty === 'Medium' ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' :
            'bg-red-500/5 text-red-500 border-red-500/20'
          }`}>
            {problem.difficulty}
          </span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{problem.topic}</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tighter leading-none">{problem.title}</h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card tool-border rounded-xl p-6 flex items-center gap-5">
          <div className="bg-primary/10 p-3 rounded text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time Complexity</p>
            <p className="text-xl font-mono font-bold tracking-tight">{problem.timeComplexity || "O(unknown)"}</p>
          </div>
        </div>
        <div className="bg-card tool-border rounded-xl p-6 flex items-center gap-5">
          <div className="bg-primary/10 p-3 rounded text-primary">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Space Complexity</p>
            <p className="text-xl font-mono font-bold tracking-tight">{problem.spaceComplexity || "O(unknown)"}</p>
          </div>
        </div>
        <div className="bg-card tool-border rounded-xl p-6 flex items-center gap-5">
          <div className="bg-primary/10 p-3 rounded text-primary">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mastery Level</p>
            <p className="text-xl font-bold tracking-tight">System Validated</p>
          </div>
        </div>
      </div>

      {/* Intelligence Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-5">
          <Lightbulb className="w-48 h-48 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-primary">The Core Insight</h2>
          </div>
          <p className="text-2xl leading-relaxed italic font-medium tracking-tight">&quot;{problem.keyInsight}&quot;</p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2 border-b border-border pb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold uppercase tracking-widest">Primary Approach</h2>
            </div>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm font-medium">
              {problem.approachSummary || "No implementation approach documented for this record."}
            </div>
          </section>

          {problem.alternateApproach && (
            <section className="bg-card tool-border rounded-xl p-8 space-y-6">
              <h2 className="text-lg font-bold uppercase tracking-widest border-b border-border pb-4">Optimization / Alternate</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm font-medium">
                {problem.alternateApproach}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-10">
          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-border pb-4">Tagged Patterns</h2>
            <div className="flex gap-2 flex-wrap">
              {problem.patterns.map((p: string) => (
                <span key={p} className="bg-muted px-3 py-1.5 rounded border border-border text-[10px] font-bold uppercase tracking-widest">
                  {p}
                </span>
              ))}
              {problem.patterns.length === 0 && <p className="text-xs text-muted-foreground italic">No pattern metadata assigned.</p>}
            </div>
          </section>

          <section className="bg-red-500/5 tool-border border-red-500/20 rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-red-500/10 pb-4">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-red-500">Known Vulnerabilities</h2>
            </div>
            <ul className="space-y-4">
              {problem.mistakes.map((m: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-xs font-medium text-red-400/80">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                  {m}
                </li>
              ))}
              {problem.mistakes.length === 0 && <p className="text-xs text-muted-foreground italic">No known edge-case failures recorded.</p>}
            </ul>
          </section>

          <SimilarProblems 
            currentId={problem._id.toString()} 
            topic={problem.topic} 
            patterns={problem.patterns} 
          />
        </div>
      </div>
    </div>
  );
}
