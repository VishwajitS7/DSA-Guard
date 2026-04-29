"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Save,
  Loader2,
  ChevronLeft,
  Book,
  Code,
  Lightbulb,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

const topics = ["Array", "String", "DP", "Graph", "Tree", "LinkedList", "Binary Search", "Sliding Window", "Recursion", "Backtracking", "Stack", "Queue", "Heap", "Trie", "Math", "Bit Manipulation"];
const difficulties = ["Easy", "Medium", "Hard"];
const commonPatterns = ["Sliding Window", "Two Pointers", "XOR", "Prefix Sum", "Binary Search", "DFS", "BFS", "Recursion", "Dynamic Programming", "Greedy", "Backtracking"];

export default function ProblemForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    topic: "Array",
    difficulty: "Medium",
    patterns: [] as string[],
    keyInsight: "",
    approachSummary: "",
    alternateApproach: "",
    timeComplexity: "",
    spaceComplexity: "",
    mistakes: [] as string[],
  });

  const [newPattern, setNewPattern] = useState("");
  const [newMistake, setNewMistake] = useState("");

  const handleAddPattern = () => {
    if (newPattern && !formData.patterns.includes(newPattern)) {
      setFormData({ ...formData, patterns: [...formData.patterns, newPattern] });
      setNewPattern("");
    }
  };

  const handleAddMistake = () => {
    if (newMistake && !formData.mistakes.includes(newMistake)) {
      setFormData({ ...formData, mistakes: [...formData.mistakes, newMistake] });
      setNewMistake("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/problems");
        router.refresh();
      }
    } catch (error) {
      console.error("Error submitting problem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in pb-20">
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/problems" className="p-2 border border-border rounded hover:bg-muted transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Log Mastery</h1>
            <p className="text-muted-foreground mt-1">Initialize a new problem record in the system.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded font-bold text-sm hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Commit to Database
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Book className="w-5 h-5 text-primary" />
              Problem Specification
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Problem Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="e.g. Longest Palindromic Substring"
                  className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Platform Reference (URL)</label>
                <input 
                  type="url" 
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  required
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Core Topic</label>
                  <select 
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full bg-muted/20 border border-border rounded py-2 px-3 focus:outline-none focus:border-primary transition-all text-sm"
                  >
                    {topics.map(t => <option key={t} value={t} className="bg-background">{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">System Difficulty</label>
                  <select 
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full bg-muted/20 border border-border rounded py-2 px-3 focus:outline-none focus:border-primary transition-all text-sm"
                  >
                    {difficulties.map(d => <option key={d} value={d} className="bg-background">{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Lightbulb className="w-5 h-5 text-primary" />
              Learning Intelligence
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">The "Key Insight" (Primary Logic)</label>
                <textarea 
                  value={formData.keyInsight}
                  onChange={(e) => setFormData({...formData, keyInsight: e.target.value})}
                  required
                  placeholder="What was the crucial logic required to solve this?"
                  className="w-full bg-muted/20 border border-border rounded py-3 px-4 h-24 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Implementation Approach</label>
                <textarea 
                  value={formData.approachSummary}
                  onChange={(e) => setFormData({...formData, approachSummary: e.target.value})}
                  placeholder="Describe your step-by-step implementation..."
                  className="w-full bg-muted/20 border border-border rounded py-3 px-4 h-32 focus:outline-none focus:border-primary transition-all text-sm resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-border pb-4">Complexity Analysis</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time (O)</label>
                <input 
                  type="text" 
                  value={formData.timeComplexity}
                  onChange={(e) => setFormData({...formData, timeComplexity: e.target.value})}
                  placeholder="O(n log n)"
                  className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Space (O)</label>
                <input 
                  type="text" 
                  value={formData.spaceComplexity}
                  onChange={(e) => setFormData({...formData, spaceComplexity: e.target.value})}
                  placeholder="O(1)"
                  className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-xs"
                />
              </div>
            </div>
          </section>

          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-border pb-4">Pattern Recognition</h2>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {formData.patterns.map(p => (
                  <span key={p} className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase border border-primary/20 flex items-center gap-1">
                    {p}
                    <button type="button" onClick={() => setFormData({...formData, patterns: formData.patterns.filter(x => x !== p)})} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  list="patterns-list"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  placeholder="New pattern..."
                  className="flex-1 bg-muted/20 border border-border rounded py-1.5 px-3 focus:outline-none focus:border-primary transition-all text-xs"
                />
                <datalist id="patterns-list">
                  {commonPatterns.map(p => <option key={p} value={p} />)}
                </datalist>
                <button type="button" onClick={handleAddPattern} className="bg-secondary px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-secondary/80 transition-all">Add</button>
              </div>
            </div>
          </section>

          <section className="bg-red-500/5 tool-border border-red-500/20 rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 border-b border-red-500/10 pb-4">Failure Analysis</h2>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {formData.mistakes.map(m => (
                  <span key={m} className="bg-red-500/10 text-red-400 px-2 py-1 rounded text-[10px] font-bold uppercase border border-red-500/20 flex items-center gap-1">
                    {m}
                    <button type="button" onClick={() => setFormData({...formData, mistakes: formData.mistakes.filter(x => x !== m)})} className="hover:text-red-600">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMistake}
                  onChange={(e) => setNewMistake(e.target.value)}
                  placeholder="New mistake/edge-case..."
                  className="flex-1 bg-muted/20 border border-border rounded py-1.5 px-3 focus:outline-none focus:border-red-500 transition-all text-xs"
                />
                <button type="button" onClick={handleAddMistake} className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-red-500/20 transition-all">Log</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
