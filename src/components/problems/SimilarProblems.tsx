"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SimilarProblems({ currentId, topic, patterns }: { currentId: string, topic: string, patterns: string[] }) {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilar() {
      try {
        const res = await fetch(`/api/problems?topic=${topic}`);
        if (res.ok) {
          const data = await res.json();
          // Filter out current problem and find pattern matches
          const filtered = data
            .filter((p: any) => p._id !== currentId)
            .sort((a: any, b: any) => {
              const aMatches = a.patterns.filter((p: string) => patterns.includes(p)).length;
              const bMatches = b.patterns.filter((p: string) => patterns.includes(p)).length;
              return bMatches - aMatches;
            })
            .slice(0, 3);
          setProblems(filtered);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(true);
      }
    }

    fetchSimilar();
  }, [currentId, topic, patterns]);

  if (problems.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Similar Problems
      </h2>
      <div className="space-y-4">
        {problems.map((p) => (
          <div key={p._id} className="flex items-center justify-between group">
            <div>
              <Link href={`/problems/${p._id}`} className="font-medium hover:text-primary transition-colors">{p.title}</Link>
              <div className="flex gap-1 mt-1">
                {p.patterns.slice(0, 2).map((pat: string) => (
                  <span key={pat} className="text-[10px] bg-secondary px-1 py-0.5 rounded text-muted-foreground">{pat}</span>
                ))}
              </div>
            </div>
            <a href={p.link} target="_blank" className="p-2 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
