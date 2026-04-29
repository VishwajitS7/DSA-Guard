import ProblemForm from "@/components/problems/ProblemForm";
import { Suspense } from "react";

export default function AddProblemPage() {
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-center">Log a New Mastery</h1>
        <p className="text-muted-foreground mt-2 text-center">Capture your insights and patterns to build your DSA intuition.</p>
      </div>

      <Suspense fallback={<div className="flex items-center justify-center p-12 text-muted-foreground">Initializing mastery log...</div>}>
        <ProblemForm />
      </Suspense>
    </div>
  );
}
