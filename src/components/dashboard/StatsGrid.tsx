"use client";

import { 
  CheckCircle2, 
  Calendar, 
  BrainCircuit, 
  TrendingUp 
} from "lucide-react";

const stats = [
  {
    name: "Total Solved",
    value: "128",
    change: "+12%",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Revision Due",
    value: "5",
    change: "-2",
    icon: Calendar,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    name: "Patterns Mastered",
    value: "12",
    change: "+1",
    icon: BrainCircuit,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    name: "Success Rate",
    value: "78%",
    change: "+4%",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export default function StatsGrid({ stats }: { stats: any }) {
  const displayStats = [
    {
      name: "Total Solved",
      value: stats.totalSolved.toString(),
      change: stats.totalSolved > 0 ? "Active" : "Neutral",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      name: "Revision Due",
      value: stats.revisionDue.toString(),
      change: stats.revisionDue > 0 ? "Pending" : "Clear",
      icon: Calendar,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      name: "Patterns Mastered",
      value: stats.patternsMastered.toString(),
      change: "Tracking",
      icon: BrainCircuit,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      name: "Success Rate",
      value: `${stats.successRate}%`,
      change: "Calculated",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat) => (
        <div key={stat.name} className="bg-card tool-border p-6 rounded-xl hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className={stat.bg + " p-2.5 rounded-lg " + stat.color}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
              stat.change === 'Clear' || stat.change === 'Calculated' || stat.change === 'Active' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
            }`}>
              {stat.change}
            </span>
          </div>
          <div className="mt-5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.name}</h3>
            <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
