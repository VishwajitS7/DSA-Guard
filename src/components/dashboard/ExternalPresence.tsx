"use client";

import { useState, useEffect } from "react";
import { Globe, RefreshCw, ExternalLink, Trophy, Code2, ShieldAlert } from "lucide-react";

interface ExternalStats {
  leetcode: { solved: number; rating: number };
  gfg: { solved: number; score: number };
  codechef: { rating: number; stars: string };
}

export default function ExternalPresence() {
  const [stats, setStats] = useState<ExternalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sync-external");
      const data = await res.json();
      setStats(data);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to sync external stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-card tool-border rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          External Global Presence
        </h3>
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LeetCode */}
        <div className="p-4 bg-muted/20 border border-border rounded-lg group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">LeetCode</span>
            <Trophy className="w-3.5 h-3.5 text-orange-500 opacity-50" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900">{stats?.leetcode.solved ?? "—"}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Solved Count</p>
          </div>
        </div>

        {/* GFG */}
        <div className="p-4 bg-muted/20 border border-border rounded-lg group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">GeeksforGeeks</span>
            <Code2 className="w-3.5 h-3.5 text-emerald-600 opacity-50" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900">
              {stats?.gfg.solved ?? "—"} 
              <span className="text-[10px] font-bold text-emerald-500 ml-1">({stats?.gfg.score ?? 0} pts)</span>
            </p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Total Solved / Score</p>
          </div>
        </div>

        {/* CodeChef */}
        <div className="p-4 bg-muted/20 border border-border rounded-lg group hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">CodeChef</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 opacity-50" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-slate-900">
              {stats?.codechef.rating ?? "—"} 
              <span className="text-sm font-bold text-rose-400 ml-1">{stats?.codechef.stars}</span>
            </p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Rating / Stars</p>
          </div>
        </div>
      </div>

      <div className="pt-2 text-center space-y-2">
        <p className="text-[10px] text-muted-foreground font-medium italic">
          Last Synced: {lastSynced || "Never"} • Public JSON/Regex parsing active.
        </p>
        {!stats && !loading && (
          <div className="text-[9px] text-red-400 font-mono">
            Debug: Ensure URLs are saved in Settings. 
            <Link href="/settings" className="underline ml-1">Go to Settings</Link>
          </div>
        )}
      </div>
    </div>
  );
}
