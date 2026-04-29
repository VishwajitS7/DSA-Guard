"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export default function RevisedButton({ problemId }: { problemId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkRevised = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/revisions/${problemId}`, {
        method: "PATCH",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error marking as revised:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleMarkRevised}
      disabled={loading}
      className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
      Mark Revised
    </button>
  );
}
