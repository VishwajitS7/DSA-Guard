import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  Key, 
  LogOut,
  Database,
  Cloud
} from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="p-20 text-center">Authentication Required</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in pb-20">
      <div className="pb-6 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Account & System Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your identity and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card tool-border rounded-xl p-8 text-center space-y-6 sticky top-24">
            <div className="relative w-24 h-24 mx-auto group">
              <img 
                src={session.user?.image || "https://avatar.vercel.sh/user"} 
                alt="Profile" 
                className="rounded-full border-4 border-primary/10 shadow-xl group-hover:opacity-75 transition-all"
              />
              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-slate-900/50 text-white p-2 rounded-full backdrop-blur-sm">
                  <Cloud className="w-4 h-4" />
                </div>
              </button>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-card shadow-lg">
                <Shield className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{session.user?.name}</h2>
              <p className="text-sm text-muted-foreground font-medium">{session.user?.email}</p>
              <button className="mt-3 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                Upload Custom Photo
              </button>
            </div>
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Account Status</span>
                <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Verified</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>System Role</span>
                <span>User</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Section */}
          <section className="bg-card tool-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border bg-slate-50/50">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Identity Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
                  <div className="p-3 bg-muted/30 border border-border rounded text-sm font-medium text-slate-600">
                    {session.user?.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Email</label>
                  <div className="p-3 bg-muted/30 border border-border rounded text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 opacity-50" />
                    {session.user?.email}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* System Preferences */}
          <section className="bg-card tool-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border bg-slate-50/50">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                System Preferences
              </h3>
            </div>
            <div className="divide-y divide-border">
              <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email Notifications</h4>
                  <p className="text-xs text-muted-foreground mt-1">Receive daily alerts for due revisions.</p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dark Mode Architecture</h4>
                  <p className="text-xs text-muted-foreground mt-1">Currently using the System Adaptive Light theme.</p>
                </div>
                <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Switch Theme</button>
              </div>
            </div>
          </section>

          {/* Security & Data */}
          <section className="bg-card tool-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border bg-slate-50/50">
              <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Security & Data Integrity
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <Database className="w-8 h-8 text-amber-500 opacity-50" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">Data Management</h4>
                  <p className="text-xs text-muted-foreground mt-1">Your logs are stored securely in our MongoDB cluster. You can export or clear your history at any time.</p>
                </div>
                <button className="px-4 py-2 bg-white border border-border rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50">Export JSON</button>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest">
                  <LogOut className="w-4 h-4" />
                  Terminal Action
                </div>
                <button className="px-6 py-2 bg-red-500 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                  Delete All Data
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
