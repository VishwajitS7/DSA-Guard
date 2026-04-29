"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  BookOpen, 
  Target, 
  BarChart3, 
  Settings,
  ShieldCheck,
  PieChart
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ADMIN_EMAIL = "your-admin-email@example.com";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Problems", href: "/problems", icon: BookOpen },
  { name: "Add Problem", href: "/problems/add", icon: PlusCircle },
  { name: "Revision", href: "/revision", icon: Target },
  { name: "Patterns", href: "/patterns", icon: BarChart3 },
  { name: "Analytics", href: "/analytics", icon: PieChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show sidebar on landing page (root when unauthenticated)
  if (!session) return null;

  const isAdmin = session.user?.email === ADMIN_EMAIL;
  const currentNavItems = isAdmin 
    ? [...navItems, { name: "Admin Console", href: "/admin", icon: ShieldCheck }]
    : navItems;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col hidden lg:flex sticky top-0 h-screen">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 relative group-hover:scale-110 transition-transform">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">GUARDIAN</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {currentNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded transition-all duration-200 font-medium text-sm group",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded text-sm text-muted-foreground hover:text-foreground transition-all"
        >
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </Link>
      </div>
    </aside>
  );
}
