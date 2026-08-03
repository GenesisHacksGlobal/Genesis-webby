import React, { useState } from "react";
import { toast } from "sonner";
import { getAdjacentArticles } from "@/features/guide/guideData";

export default function GuideContent({
  category,
  article,
  onSelectArticle
}) {
  const [checklistState, setChecklistState] = useState({});
  const [feedbackGiven, setFeedbackGiven] = useState(null);

  if (!article || !category) return null;

  const { prev, next } = getAdjacentArticles(category.id, article.slug);

  const toggleCheckItem = (id) => {
    setChecklistState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFeedback = (type) => {
    setFeedbackGiven(type);
    toast.success(
      type === "yes"
        ? "Thank you for your feedback!"
        : "Thanks! We'll keep improving this guide."
    );
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Guide URL copied to clipboard!");
  };

  return (
    <div className="flex-1 min-w-0 max-w-4xl px-4 sm:px-8 py-8 space-y-8 text-white/90">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-white/50">
        <span>Guide</span>
        <span>/</span>
        <span className="text-[#c4b5fd]">{category.title}</span>
        <span>/</span>
        <span className="text-white/80 font-medium truncate">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 pb-6 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl sm:text-4xl text-[#e2efba] uppercase tracking-wide leading-tight">
            {article.title}
          </h1>

          {/* Quick Share / Copy URL */}
          <button
            type="button"
            onClick={copyPageLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-xs text-white/70 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy Link</span>
          </button>
        </div>

        {article.content?.subtitle && (
          <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
            {article.content.subtitle}
          </p>
        )}

        {/* Metadata Bar */}
        <div className="flex items-center gap-4 text-xs font-mono text-white/40 pt-2">
          <span>Updated {article.lastUpdated}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
      </header>

      {/* Hero / Intro Block */}
      {article.content?.heroText && (
        <div className="p-5 rounded-lg bg-white/[0.03] border border-white/10 text-white/90 text-sm leading-relaxed">
          {article.content.heroText}
        </div>
      )}

      {/* Optional Video Embed */}
      {article.content?.videoEmbed && (
        <div className="space-y-2">
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/15 bg-black">
            <iframe
              src={article.content.videoEmbed.url}
              title={article.content.videoEmbed.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <p className="text-xs text-white/50 text-center font-mono">
            {article.content.videoEmbed.caption}
          </p>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="space-y-10">
        {article.content?.sections?.map((sec) => (
          <section key={sec.id} id={sec.id} className="space-y-4 scroll-mt-28">
            <h2 className="font-display text-xl text-[#e2efba] uppercase tracking-wider flex items-center gap-2 group">
              <span>{sec.title}</span>
              <a
                href={`#${sec.id}`}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-white/80 transition-opacity text-sm font-mono"
              >
                #
              </a>
            </h2>

            {sec.text && (
              <p className="text-sm sm:text-base leading-relaxed text-white/80 whitespace-pre-line">
                {sec.text}
              </p>
            )}

            {/* Callout Box */}
            {sec.callout && (
              <div
                className={`p-4 rounded border text-xs sm:text-sm leading-relaxed space-y-1 ${
                  sec.callout.type === "warning"
                    ? "bg-red-500/10 border-red-500/30 text-red-200"
                    : sec.callout.type === "important"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                    : sec.callout.type === "tip"
                    ? "bg-[#e2efba]/10 border-[#e2efba]/30 text-[#e2efba]"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-200"
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[11px] font-mono">
                  {sec.callout.title}
                </div>
                <div>{sec.callout.text}</div>
              </div>
            )}

            {/* Interactive Checklist */}
            {sec.checklist && (
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
                <div className="font-display text-xs text-[#c4b5fd] uppercase tracking-wider">
                  Operational Checklist
                </div>
                <div className="space-y-2">
                  {sec.checklist.map((item) => {
                    const isChecked = checklistState[item.id] || false;
                    return (
                      <label
                        key={item.id}
                        onClick={() => toggleCheckItem(item.id)}
                        className="flex items-start gap-3 p-2 rounded hover:bg-white/5 cursor-pointer text-xs sm:text-sm transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded border-white/30 bg-transparent text-[#e2efba] focus:ring-0"
                        />
                        <span className={isChecked ? "line-through text-white/40" : "text-white/90"}>
                          {item.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Downloadable Resource Links */}
            {sec.resourceLinks && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {sec.resourceLinks.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info(`Opening ${res.title}`);
                    }}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#e2efba]/50 rounded text-xs flex items-center justify-between group transition-all"
                  >
                    <span className="font-medium text-white/90 group-hover:text-[#e2efba] truncate">
                      {res.title}
                    </span>
                    <svg className="w-4 h-4 text-white/40 group-hover:text-[#e2efba] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Helpful Feedback Widget */}
      <div className="pt-8 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-white/60 font-mono">
          Was this page helpful?
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFeedback("yes")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
              feedbackGiven === "yes"
                ? "bg-[#e2efba] text-black border-[#e2efba]"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-white/80"
            }`}
          >
            👍 Yes
          </button>
          <button
            type="button"
            onClick={() => handleFeedback("no")}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
              feedbackGiven === "no"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-white/80"
            }`}
          >
            👎 No
          </button>
        </div>
      </div>

      {/* Footer Navigation (Prev / Next Article) */}
      <footer className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10">
        {prev ? (
          <button
            type="button"
            onClick={() => onSelectArticle(prev.categoryId, prev.slug)}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-left space-y-1 transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-white/40 group-hover:text-white/60">
              ← Previous
            </div>
            <div className="text-sm font-semibold text-white group-hover:text-[#e2efba] truncate">
              {prev.title}
            </div>
          </button>
        ) : <div />}

        {next ? (
          <button
            type="button"
            onClick={() => onSelectArticle(next.categoryId, next.slug)}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-right space-y-1 transition-all group"
          >
            <div className="text-[10px] font-mono uppercase text-white/40 group-hover:text-white/60">
              Next →
            </div>
            <div className="text-sm font-semibold text-white group-hover:text-[#e2efba] truncate">
              {next.title}
            </div>
          </button>
        ) : <div />}
      </footer>
    </div>
  );
}
