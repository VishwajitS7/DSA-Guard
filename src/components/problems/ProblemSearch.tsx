"use client";

import { Search, Filter, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const topics = ["Array", "String", "DP", "Graph", "Tree", "LinkedList", "Binary Search", "Sliding Window", "Recursion", "Backtracking", "Stack", "Queue", "Heap", "Trie", "Math", "Bit Manipulation"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function ProblemSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get("topic") || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get("difficulty") || "");
  
  const initialRender = useRef(true);

  // Synchronize state when URL parameters change externally (e.g., clear or back button)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSelectedTopic(searchParams.get("topic") || "");
    setSelectedDifficulty(searchParams.get("difficulty") || "");
  }, [searchParams]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (search !== currentSearch) {
        updateUrl({ search });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, searchParams]);

  const updateUrl = (paramsToUpdate: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    for (const [key, value] of Object.entries(paramsToUpdate)) {
      if (value === null || value === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    }
    
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "topic") setSelectedTopic(value);
    if (key === "difficulty") setSelectedDifficulty(value);
    updateUrl({ [key]: value });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTopic("");
    setSelectedDifficulty("");
    router.push(pathname);
  };

  const activeFiltersCount = [selectedTopic, selectedDifficulty].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative group flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-muted/30 border border-border rounded py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all w-full md:w-64"
          />
          {search && (
            <button 
              onClick={() => {
                setSearch("");
                updateUrl({ search: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 border border-border rounded bg-muted/20 hover:bg-muted transition-all text-sm font-medium ${showFilters || activeFiltersCount > 0 ? 'border-primary text-primary' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {(search || activeFiltersCount > 0) && (
          <button 
            onClick={clearFilters}
            className="text-xs font-bold text-muted-foreground hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/20 border border-border rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Topic</label>
            <select 
              value={selectedTopic}
              onChange={(e) => handleFilterChange("topic", e.target.value)}
              className="block w-40 bg-background border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary transition-all"
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Difficulty</label>
            <select 
              value={selectedDifficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="block w-40 bg-background border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary transition-all"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
