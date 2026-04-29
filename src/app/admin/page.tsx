"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Users, ShieldCheck, Activity, Globe, ArrowLeft, Search, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalRefresh = async () => {
    if (!confirm("This will clear the cache for all users. Continue?")) return;
    setLoading(true);
    try {
      await fetch("/api/admin/stats", { method: "POST" });
      alert("Global cache cleared. Users will re-sync on their next visit.");
      fetchStats();
    } catch (e) {
      alert("Failed to trigger global sync");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`CRITICAL: Are you sure you want to delete ${userName}? This will permanently purge all their problems and data.`)) return;
    if (!confirm(`FINAL WARNING: This action cannot be undone. Purge ${userName}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stats?userId=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchStats();
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("System error during purge.");
    } finally {
      setLoading(false);
    }
  };

  if (session?.user && (session.user as any).role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center space-y-4">
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-900">Access Restricted</h1>
          <p className="text-slate-500">You do not have permission to view this page.</p>
          <Link href="/dashboard" className="text-primary hover:underline block">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const filteredUsers = stats?.users?.filter((u: any) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/dashboard" className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest mb-2">
              <ArrowLeft className="w-3 h-3" /> Back to App
            </Link>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Admin Pulse
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">System Owner</span>
            </h1>
            <p className="text-slate-500 font-medium">Monitoring the Patternix ecosystem.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGlobalRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-primary transition-all uppercase tracking-widest disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Global Refresh
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-64 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Platform Users" value={stats?.totalUsers || 0} icon={<Users className="w-5 h-5" />} color="text-blue-600" />
          <StatCard title="Problems Tracked in Patternix" value={stats?.totalProblems || 0} icon={<Activity className="w-5 h-5" />} color="text-emerald-500" />
        </div>

        {/* User Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">User Directory</h3>
            <span className="text-xs text-slate-400 font-medium">{filteredUsers?.length || 0} users found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Problems (Internal)</th>
                  <th className="px-6 py-4">LeetCode</th>
                  <th className="px-6 py-4">GFG</th>
                  <th className="px-6 py-4">CodeChef</th>
                  <th className="px-6 py-4">Last Sync</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">Loading system data...</td></tr>
                ) : filteredUsers?.map((u: any) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                        <span className="text-xs text-slate-500">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary">{u.problemCount || 0}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Problems</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-orange-600">{u.externalStats?.leetcode?.solved || 0}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Solved</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-emerald-600">{u.externalStats?.gfg?.score || 0}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Points</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-rose-600">{u.externalStats?.codechef?.rating || 0}</span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{u.externalStats?.codechef?.stars || 'Unrated'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {u.lastSyncedAt ? new Date(u.lastSyncedAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        disabled={loading || u._id === (session?.user as any)?.id}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-20"
                        title="Purge User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: any, icon: any, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <div className={`${color} bg-current/10 p-2 rounded-lg`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
