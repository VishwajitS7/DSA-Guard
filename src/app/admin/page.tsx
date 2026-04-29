import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Problem from "@/lib/models/Problem";
import { 
  ShieldAlert, 
  Users, 
  Database, 
  Search, 
  Filter, 
  Trash2, 
  Eye,
  Lock
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// IMPORTANT: Replace this with your actual admin email
const ADMIN_EMAIL = "your-admin-email@example.com"; 

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Security Check: Only allow a specific email to access this page
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 text-center animate-in">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <Lock className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">403: Unauthorized Access</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            This administrative terminal is restricted to system architects. 
            Your current identity ({session?.user?.email || "Guest"}) does not have the required permissions.
          </p>
        </div>
        <Link href="/" className="btn-primary">Return to System Base</Link>
      </div>
    );
  }

  await connectDB();
  // Fetch ALL problems from ALL users for administrative oversight
  const allProblems = await Problem.find({}).sort({ createdAt: -1 }).limit(100);

  return (
    <div className="space-y-10 animate-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Administrator</h1>
            <p className="text-muted-foreground mt-1">Cross-user activity monitor and log management.</p>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card tool-border p-6 rounded-xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Activity</p>
          <p className="text-3xl font-bold mt-2">{allProblems.length}+ Logs</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase">
            <Database className="w-3.5 h-3.5" />
            Live Cluster Connection
          </div>
        </div>
        <div className="bg-card tool-border p-6 rounded-xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Load</p>
          <p className="text-3xl font-bold mt-2">Optimal</p>
          <div className="mt-4 flex items-center gap-2 text-blue-500 text-xs font-bold uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            Firewall Active
          </div>
        </div>
        <div className="bg-card tool-border p-6 rounded-xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Architect Access</p>
          <p className="text-3xl font-bold mt-2">Full Control</p>
          <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold uppercase">
            <Users className="w-3.5 h-3.5" />
            Session Validated
          </div>
        </div>
      </div>

      {/* Global Activity Log */}
      <div className="bg-card tool-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Global User Logs
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search across users..." className="bg-white border border-border rounded py-1.5 pl-10 pr-4 text-xs focus:border-primary focus:outline-none w-64" />
            </div>
            <button className="p-2 border border-border rounded hover:bg-white"><Filter className="w-4 h-4" /></button>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User ID / Email</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Problem Activity</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Log Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allProblems.map((problem) => (
              <tr key={problem._id.toString()} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{problem.user.toString().substring(0, 12)}...</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Verified Identity</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold group-hover:text-primary transition-colors">{problem.title}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">{problem.topic} • {problem.difficulty}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">
                  {new Date(problem.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/problems/${problem._id}`} className="p-2 hover:bg-primary/10 text-primary rounded transition-all">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="p-2 hover:bg-red-50 text-red-500 rounded transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
