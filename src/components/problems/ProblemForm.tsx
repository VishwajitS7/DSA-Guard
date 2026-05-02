"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Save,
  Loader2,
  ChevronLeft,
  Book,
  Lightbulb,
  Upload,
  Trash2,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";

const topics = ["Array", "String", "DP", "Graph", "Tree", "LinkedList", "Binary Search", "Sliding Window", "Recursion", "Backtracking", "Stack", "Queue", "Heap", "Trie", "Math", "Bit Manipulation"];
const difficulties = ["Easy", "Medium", "Hard"];
const commonPatterns = ["Sliding Window", "Two Pointers", "XOR", "Prefix Sum", "Binary Search", "DFS", "BFS", "Recursion", "Dynamic Programming", "Greedy", "Backtracking"];

interface ProblemFormProps {
  initialData?: any;
  problemId?: string;
}

export default function ProblemForm({ initialData, problemId }: ProblemFormProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [isQuickLog, setIsQuickLog] = useState(!initialData);
  
  interface NoteFile {
    url: string;
    format: string;
    publicId: string;
  }

  const [formData, setFormData] = useState({
    title: initialData?.title || searchParams.get("title") || "",
    link: initialData?.link || searchParams.get("link") || searchParams.get("url") || "",
    topic: initialData?.topic || searchParams.get("topic") || "Array",
    difficulty: initialData?.difficulty || searchParams.get("difficulty") || "Medium",
    patterns: initialData?.patterns || ([] as string[]),
    keyInsight: initialData?.keyInsight || "",
    approachSummary: initialData?.approachSummary || "",
    alternateApproach: initialData?.alternateApproach || "",
    timeComplexity: initialData?.timeComplexity || "",
    spaceComplexity: initialData?.spaceComplexity || "",
    mistakes: initialData?.mistakes || ([] as string[]),
    notes: (initialData?.notes || []) as NoteFile[],
  });

  const [newPattern, setNewPattern] = useState("");
  const [newMistake, setNewMistake] = useState("");

  // Keyboard Shortcut: Cmd/Ctrl + Enter to Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSubmit(new Event("submit") as any);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formData, loading]);

  const topicToPatterns: Record<string, string[]> = {
    "Array": ["Two Pointers", "Sliding Window", "Prefix Sum", "Kadane's"],
    "String": ["Sliding Window", "Two Pointers", "KMP", "Z-Algorithm"],
    "DP": ["Memoization", "Tabulation", "State Compression", "Knapsack"],
    "Graph": ["DFS", "BFS", "Dijkstra", "Topological Sort", "Union Find"],
    "Tree": ["DFS", "BFS", "Level Order", "Recursion"],
    "LinkedList": ["Two Pointers", "Fast & Slow Pointers", "In-place Reversal"],
  };

  const handleAddPattern = (pattern: string) => {
    if (pattern && !formData.patterns.includes(pattern)) {
      setFormData({ ...formData, patterns: [...formData.patterns, pattern] });
      setNewPattern("");
    }
  };

  const handleAddMistake = () => {
    if (newMistake && !formData.mistakes.includes(newMistake)) {
      setFormData({ ...formData, mistakes: [...formData.mistakes, newMistake] });
      setNewMistake("");
    }
  };

  const handleNoteUpload = (result: any) => {
    const info = result?.info;
    if (!info) return;
    const newNote: NoteFile = {
      url: info.secure_url,
      format: info.format || info.resource_type,
      publicId: info.public_id,
    };
    setFormData(prev => ({ ...prev, notes: [...prev.notes, newNote] }));
  };

  const handleRemoveNote = (publicId: string) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.publicId !== publicId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = problemId ? `/api/problems/${problemId}` : "/api/problems";
      const method = problemId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/problems");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Failed to save problem: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting problem:", error);
      alert("An unexpected error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMetadata = async () => {
    if (!formData.link) {
      alert("Please enter a URL first.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/fetch-metadata", {
        method: "POST",
        body: JSON.stringify({ url: formData.link }),
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        difficulty: data.difficulty || prev.difficulty,
        topic: data.topic || prev.topic,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch metadata automatically. Please enter it manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/problems" className="p-2 border border-border rounded hover:bg-muted transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{problemId ? "Edit Log" : "Log Mastery"}</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-muted-foreground">{problemId ? "Update your problem record." : "Initialize a new problem record."}</p>
              <div className="h-4 w-px bg-border"></div>
              <button 
                onClick={() => setIsQuickLog(!isQuickLog)}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${isQuickLog ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {isQuickLog ? 'Quick Log Active' : 'Switch to Quick Log'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Press {navigator?.platform?.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to Save
          </span>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded font-bold text-sm hover:shadow-xl transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {problemId ? "Update Log" : "Commit Log"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <h2 className="text-lg font-bold flex items-center justify-between border-b border-border pb-4 mb-6">
              <span className="flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" />
                Problem Specification
              </span>
              <button 
                type="button"
                onClick={handleFetchMetadata}
                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
              >
                Fetch Metadata 🪄
              </button>
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">URL Reference</label>
                  <input 
                    type="url" 
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    required
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full bg-muted/20 border border-border rounded py-2 px-4 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Topic</label>
                  <select 
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full bg-muted/20 border border-border rounded py-2 px-3 focus:outline-none focus:border-primary transition-all text-sm"
                  >
                    {topics.map(t => <option key={t} value={t} className="bg-background">{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Difficulty</label>
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

          {!isQuickLog && (
            <section className="bg-card tool-border rounded-xl p-8 space-y-6 animate-in slide-in-from-top-4">
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
          )}

          {/* Handwritten Notes Upload — always visible */}
          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Handwritten Notes
              </h2>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                options={{
                  sources: ["local"],
                  multiple: true,
                  clientAllowedFormats: ["pdf", "jpg", "jpeg", "png", "webp"],
                  maxFileSize: 10000000, // 10 MB
                  resourceType: "auto",
                }}
                onSuccess={handleNoteUpload}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded font-bold text-xs uppercase tracking-widest border border-primary/20 hover:bg-primary hover:text-white transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Notes
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {formData.notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border rounded-lg text-muted-foreground">
                <FileText className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No notes uploaded yet</p>
                <p className="text-[10px] mt-1 opacity-60">Supports PDF, JPG, PNG — up to 10 MB each</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.notes.map((note) => {
                  const isPdf = note.format === "pdf";
                  return (
                    <div
                      key={note.publicId}
                      className="group relative flex items-center gap-3 bg-muted/20 border border-border rounded-lg p-3 hover:border-primary/40 transition-all"
                    >
                      <div className="shrink-0 w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                        {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest truncate">
                          {note.publicId.split("/").pop()}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">{note.format}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <a
                          href={note.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-primary hover:underline uppercase"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveNote(note.publicId)}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
                          title="Remove note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-card tool-border rounded-xl p-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-border pb-4">Pattern Recognition</h2>
            
            <div className="space-y-4">
              {/* Suggested Patterns */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Suggested for {formData.topic}</label>
                <div className="flex gap-2 flex-wrap">
                  {topicToPatterns[formData.topic]?.map(p => (
                    <button 
                      key={p}
                      type="button"
                      onClick={() => handleAddPattern(p)}
                      className="bg-primary/5 text-primary px-2 py-1 rounded text-[10px] font-bold uppercase border border-primary/20 hover:bg-primary hover:text-white transition-all"
                    >
                      + {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap pt-4 border-t border-border">
                {formData.patterns.map((p: string) => (
                  <span key={p} className="bg-primary text-white px-2 py-1 rounded text-[10px] font-bold uppercase border border-primary/20 flex items-center gap-1">
                    {p}
                    <button type="button" onClick={() => setFormData({...formData, patterns: formData.patterns.filter((x: string) => x !== p)})} className="hover:text-red-300">×</button>
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  list="patterns-list"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  placeholder="Custom pattern..."
                  className="flex-1 bg-muted/20 border border-border rounded py-1.5 px-3 focus:outline-none focus:border-primary transition-all text-xs"
                />
                <button type="button" onClick={() => handleAddPattern(newPattern)} className="bg-secondary px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-secondary/80 transition-all">Add</button>
              </div>
            </div>
          </section>

          {!isQuickLog && (
            <>
              <section className="bg-card tool-border rounded-xl p-8 space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b border-border pb-4">Complexity</h2>
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
                </div>
              </section>

              <section className="bg-red-500/5 tool-border border-red-500/20 rounded-xl p-8 space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-red-500 border-b border-red-500/10 pb-4">Failure Analysis</h2>
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {formData.mistakes.map((m: string) => (
                      <span key={m} className="bg-red-500/10 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-red-500/20 flex items-center gap-1">
                        {m}
                        <button type="button" onClick={() => setFormData({...formData, mistakes: formData.mistakes.filter((x: string) => x !== m)})} className="hover:text-red-800">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newMistake}
                      onChange={(e) => setNewMistake(e.target.value)}
                      placeholder="Log mistake..."
                      className="flex-1 bg-muted/20 border border-border rounded py-1.5 px-3 focus:outline-none focus:border-red-500 transition-all text-xs"
                    />
                    <button type="button" onClick={handleAddMistake} className="bg-red-500/10 text-red-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-red-500/20 transition-all">Log</button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
