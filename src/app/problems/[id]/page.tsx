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
  FileCode,
  Pencil,
  FileText,
  Download
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
          <Link
            href={`/problems/edit/${problem._id}`}
            className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded transition-all text-xs font-bold uppercase tracking-widest"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Link>
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

          {/* Handwritten Notes */}
          {problem.notes && problem.notes.length > 0 && (
            <section className="bg-card tool-border rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold uppercase tracking-widest">Handwritten Notes</h2>
                <span className="ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">
                  {problem.notes.length} {problem.notes.length === 1 ? "file" : "files"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {problem.notes.map((note: { url: string; format?: string | null; publicId?: string | null }, idx: number) => {
                  const isPdf = note.format === "pdf";
                  const isImage = ["jpg", "jpeg", "png", "webp"].includes((note.format ?? "").toLowerCase());
                  return (
                    <a
                      key={note.publicId || idx}
                      href={note.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
                    >
                      {isImage ? (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={note.url}
                            alt={`Note ${idx + 1}`}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-all bg-white/90 text-black font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1.5">
                              <Download className="w-3 h-3" /> Open
                            </span>
                          </div>
                          <div className="px-4 py-3 bg-card border-t border-border">
                            <p className="text-xs font-bold uppercase tracking-widest truncate">{note.publicId?.split("/").pop() || `Note ${idx + 1}`}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase">{note.format}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold uppercase tracking-widest truncate">{note.publicId?.split("/").pop() || `Note ${idx + 1}`}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase">PDF Document</p>
                          </div>
                          <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </div>
                      )}
                    </a>
                  );
                })}
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
