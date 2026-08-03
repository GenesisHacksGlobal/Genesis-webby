import React, { useEffect, useState } from "react";
import { ALL_GUIDE_ARTICLES } from "@/features/guide/guideData";

export default function GuideSearchModal({ isOpen, onClose, onSelectArticle }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter articles based on query
  const filtered = ALL_GUIDE_ARTICLES.filter((art) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const titleMatch = art.title.toLowerCase().includes(q);
    const descMatch = art.desc.toLowerCase().includes(q);
    const catMatch = art.categoryTitle.toLowerCase().includes(q);
    const sectionMatch = art.content?.sections?.some(
      (s) => s.title.toLowerCase().includes(q) || s.text.toLowerCase().includes(q)
    );
    return titleMatch || descMatch || catMatch || sectionMatch;
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        onSelectArticle(selected.categoryId, selected.slug);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelectArticle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#131518] border border-white/20 shadow-2xl rounded-lg overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-[#181a1f]">
          <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guide topics, checklists, templates..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40 font-sans"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 rounded transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-sm font-mono">
              No matching guide topics found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={`${item.categoryId}-${item.slug}`}
                  type="button"
                  onClick={() => {
                    onSelectArticle(item.categoryId, item.slug);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded flex items-start justify-between gap-3 transition-colors ${
                    isSelected
                      ? "bg-[#e2efba]/15 text-white border-l-2 border-[#e2efba]"
                      : "hover:bg-white/5 text-white/80"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase text-[#c4b5fd] bg-[#c4b5fd]/10 px-1.5 py-0.5 rounded">
                        {item.categoryTitle}
                      </span>
                      <span className="font-semibold text-sm text-white truncate">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 truncate">{item.desc}</p>
                  </div>
                  <span className="text-[11px] font-mono text-white/40 shrink-0">
                    {item.readTime}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0c0d0e] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
          <span>Navigate with ↑ ↓ and Press Enter to select</span>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
}
