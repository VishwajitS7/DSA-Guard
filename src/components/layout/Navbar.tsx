"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Search, Bell, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  // If no session, the Landing Page handles its own navigation or we show a simple public header
  if (!session) {
    return (
      <header className="h-20 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <button 
          onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 font-bold text-xl tracking-tighter"
        >
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-black">G</span>
          </div>
          DSA GUARDIAN
        </button>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest"
          >
            Features
          </button>
          <button 
            onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest"
          >
            Philosophy
          </button>
          <button 
            onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest"
          >
            Workflow
          </button>
          <button 
            onClick={() => signIn("google")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded font-bold text-sm hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-50 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search problems, patterns, insights..." 
            className="w-full bg-muted/30 border border-border rounded py-1.5 pl-10 pr-4 focus:outline-none focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-background"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none uppercase tracking-widest">{session.user?.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Free Tier User</p>
          </div>
          <div className="relative group">
            <img 
              src={session.user?.image || "https://avatar.vercel.sh/user"} 
              alt="User" 
              className="w-8 h-8 rounded border border-border cursor-pointer grayscale hover:grayscale-0 transition-all"
            />
            <div className="absolute right-0 mt-3 w-48 bg-card border border-border rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors">
                  <User className="w-3.5 h-3.5" />
                  Profile Account
                </button>
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-400/10 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
