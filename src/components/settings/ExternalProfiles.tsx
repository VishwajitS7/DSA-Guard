"use client";

import { useState } from "react";
import { ExternalLink, Check, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExternalProfilesProps {
  initialUrls: {
    leetcodeUrl?: string;
    gfgUrl?: string;
    codechefUrl?: string;
  };
}

export default function ExternalProfiles({ initialUrls }: ExternalProfilesProps) {
  const router = useRouter();
  const [urls, setUrls] = useState(initialUrls);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/update-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urls),
      });
      if (res.ok) {
        setMessage("Profiles updated successfully! 🚀");
        router.refresh();
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      setMessage("Error updating profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card tool-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="p-6 border-b border-border bg-slate-50/50 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-primary" />
          External Competitive Profiles
        </h3>
        {message && <span className="text-[10px] font-bold text-emerald-500 uppercase animate-pulse">{message}</span>}
      </div>
      
      <div className="p-8 space-y-6">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Connect your accounts to monitor your global progress. Patternix will periodically sync your <strong>Solved Count</strong> and <strong>Contest Ratings</strong> from these platforms.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">LeetCode Profile URL</label>
            <input 
              type="url" 
              value={urls.leetcodeUrl || ""}
              onChange={(e) => setUrls({ ...urls, leetcodeUrl: e.target.value })}
              placeholder="https://leetcode.com/u/your-username/"
              className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">GeeksforGeeks Profile URL</label>
            <input 
              type="url" 
              value={urls.gfgUrl || ""}
              onChange={(e) => setUrls({ ...urls, gfgUrl: e.target.value })}
              placeholder="https://www.geeksforgeeks.org/user/your-username/"
              className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CodeChef Profile URL</label>
            <input 
              type="url" 
              value={urls.codechefUrl || ""}
              onChange={(e) => setUrls({ ...urls, codechefUrl: e.target.value })}
              placeholder="https://www.codechef.com/users/your-username"
              className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold text-xs hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sync & Save Profiles
        </button>
      </div>
    </section>
  );
}
