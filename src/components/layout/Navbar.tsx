"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Search, Bell, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // If no session, the Landing Page handles its own navigation or we show a simple public header
  if (!session) {
    return (
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 relative group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-[0.1em] text-slate-900">PATTERNIX</span>
          </button>

          <div className="flex items-center gap-10">
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[10px] font-bold text-slate-500 hover:text-primary transition-all uppercase tracking-[0.2em]"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[10px] font-bold text-slate-500 hover:text-primary transition-all uppercase tracking-[0.2em]"
              >
                Philosophy
              </button>
              <button 
                onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[10px] font-bold text-slate-500 hover:text-primary transition-all uppercase tracking-[0.2em]"
              >
                Workflow
              </button>
            </nav>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <button 
              onClick={() => signIn("google")}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all uppercase tracking-widest"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="h-20 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-12 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">System / {pathname === "/" ? "Dashboard" : pathname.split("/")[1]}</h2>
      </div>
      
      <div className="flex items-center gap-6">
        {/* User Profile Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-muted transition-all">
            <img 
              src={session.user?.image || "https://avatar.vercel.sh/user"} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-border"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-none">{session.user?.name?.split(" ")[0]}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">Verified</p>
            </div>
          </div>
          
          <div className="absolute right-0 mt-3 w-48 bg-card border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              <Link 
                href="/settings"
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Profile & Settings
              </Link>
              <div className="h-px bg-border mx-2"></div>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Terminate Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
