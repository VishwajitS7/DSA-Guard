"use client";

import { useState, useEffect } from "react";
import { Globe, RefreshCw, ExternalLink, Trophy, Code2, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface ExternalStats {
  leetcode: { solved: number; rating: number };
  gfg: { solved: number; score: number };
  codechef: { rating: number; stars: string };
}

export default function ExternalPresence() {
  const [stats, setStats] = useState<ExternalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const fetchStats = async (force = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sync-external${force ? "?force=true" : ""}`);
      const data = await res.json();
      setStats(data);
      setIsCached(data.cached);
      if (data.lastSyncedAt) {
        setLastSynced(new Date(data.lastSyncedAt).toLocaleString());
      }
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
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            External Global Presence
          </h3>
          {isCached && (
            <span className="text-[9px] font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-tighter">Cached Snapshot</span>
          )}
        </div>
        <button 
          onClick={() => fetchStats(true)}
          disabled={loading}
          className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LeetCode */}
        <div className="p-5 bg-white/40 border border-border rounded-2xl group hover:border-primary/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">LeetCode</span>
            <Trophy className="w-4 h-4 text-orange-500 opacity-60" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stats?.leetcode?.solved ?? "—"}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Solved Problems</p>
          </div>
        </div>

        {/* GFG */}
        <div className="p-5 bg-white/40 border border-border rounded-2xl group hover:border-primary/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">GeeksforGeeks</span>
            <Code2 className="w-4 h-4 text-emerald-600 opacity-60" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {stats?.gfg?.solved ?? "—"} 
            </p>
            <p className="text-[11px] text-emerald-600/70 font-bold uppercase tracking-wide">
              {stats?.gfg?.score ?? 0} Points Earned
            </p>
          </div>
        </div>

        {/* CodeChef */}
        <div className="p-5 bg-white/40 border border-border rounded-2xl group hover:border-primary/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">CodeChef</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 opacity-60" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
              {stats?.codechef?.rating ?? "—"}
              <span className="text-lg font-bold text-rose-400">{stats?.codechef?.stars}</span>
            </p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Global Rating</p>
          </div>
        </div>
      </div>

      <div className="pt-2 text-center space-y-2">
        <p className="text-[10px] text-muted-foreground font-medium italic">
          Last Sync: {lastSynced || "Syncing..."} • Data refreshed every 24h.
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
