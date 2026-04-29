import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { ExternalLink, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import ProblemSearch from "@/components/problems/ProblemSearch";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <BookOpen className="w-16 h-16 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">Authentication Required</h2>
        <p className="text-muted-foreground text-center max-w-md">Please sign in to access your problem repository.</p>
      </div>
    );
  }

  await connectDB();
  
  // Build query
  const userId = (session.user as any).id;
  const query: any = { user: userId };
  
  const searchParamsAwaited = await searchParams;
  const search = typeof searchParamsAwaited.search === "string" ? searchParamsAwaited.search : undefined;
  const topic = typeof searchParamsAwaited.topic === "string" ? searchParamsAwaited.topic : undefined;
  const difficulty = typeof searchParamsAwaited.difficulty === "string" ? searchParamsAwaited.difficulty : undefined;

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  if (topic) {
    query.topic = topic;
  }
  if (difficulty) {
    query.difficulty = difficulty;
  }

  const problems = await Problem.find(query).sort({ createdAt: -1 });

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problem Repository</h1>
          <p className="text-muted-foreground mt-1">Found {problems.length} problems in your system.</p>
        </div>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="w-64 h-10 bg-muted animate-pulse rounded"></div>}>
            <ProblemSearch />
          </Suspense>
          <div className="h-8 w-px bg-border hidden md:block mx-2"></div>
          <Link href="/problems/add" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-bold text-sm hover:opacity-90 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" />
            New Problem
          </Link>
        </div>
      </div>

      <div className="bg-card tool-border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Title & Source</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Topic</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Difficulty</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Primary Pattern</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {problems.map((problem) => (
              <tr key={problem._id} className="table-row-hover transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <Link href={`/problems/${problem._id}`} className="font-bold text-sm hover:text-primary transition-colors">{problem.title}</Link>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Created: {new Date(problem.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-muted border border-border">{problem.topic}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    problem.difficulty === 'Easy' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' :
                    problem.difficulty === 'Medium' ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' :
                    'bg-red-500/5 text-red-500 border-red-500/20'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {problem.patterns.slice(0, 1).map((p: string) => (
                      <span key={p} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p}</span>
                    ))}
                    {problem.patterns.length > 1 && <span className="text-[10px] text-muted-foreground font-medium">+{problem.patterns.length - 1} more</span>}
                    {problem.patterns.length === 0 && <span className="text-[10px] text-muted-foreground">Untagged</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a href={problem.link} target="_blank" className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link href={`/problems/${problem._id}`} className="text-xs font-bold text-primary hover:underline uppercase tracking-widest px-3 py-1.5 rounded hover:bg-primary/5 transition-all">
                      Review
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic text-sm">
                  {search || topic || difficulty ? "No problems match your search criteria." : "The repository is currently empty. Initialize by adding your first solved problem."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

