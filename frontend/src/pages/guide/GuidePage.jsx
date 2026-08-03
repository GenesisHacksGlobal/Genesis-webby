import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/widgets/layout/Navbar";
import Footer from "@/widgets/layout/Footer";
import GuideSidebar from "./components/GuideSidebar";
import GuideToc from "./components/GuideToc";
import GuideContent from "./components/GuideContent";
import GuideSearchModal from "./components/GuideSearchModal";
import { getGuideArticle, GUIDE_CATEGORIES } from "@/features/guide/guideData";

export default function GuidePage() {
  const { category: paramCategory, slug: paramSlug } = useParams();
  const navigate = useNavigate();

  // Fallback defaults
  const activeCategory = paramCategory || "introduction";
  const activeSlug = paramSlug || "overview";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const articleData = getGuideArticle(activeCategory, activeSlug);

  // Keyboard shortcut for search modal Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectArticle = (catId, slug) => {
    navigate(`/guide/${catId}/${slug}`);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col selection:bg-white selection:text-black">
      {/* Global Navbar */}
      <Navbar />

      {/* Mobile Guide Header Bar */}
      <div className="md:hidden mt-[72px] px-4 py-3 bg-[#121214] border-b border-white/10 flex items-center justify-between z-30">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-mono text-[#e2efba] bg-white/5 border border-white/10 px-3 py-1.5 rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Guide Topics</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-1.5 text-xs text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-[90rem] w-full mx-auto flex pt-0 md:pt-[72px] relative">
        {/* Left Desktop Sidebar */}
        <div className="hidden md:block w-72 shrink-0 border-r border-white/10 sticky top-[72px] h-[calc(100vh-72px)] overflow-hidden">
          <GuideSidebar
            currentCatId={activeCategory}
            currentSlug={activeSlug}
            onSelectArticle={handleSelectArticle}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        </div>

        {/* Mobile Drawer Overlay */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-[#121214] h-full flex flex-col z-10 shadow-2xl">
              <div className="p-3 border-b border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-xs font-mono px-2.5 py-1 bg-white/10 text-white/80 rounded"
                >
                  Close ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <GuideSidebar
                  currentCatId={activeCategory}
                  currentSlug={activeSlug}
                  onSelectArticle={handleSelectArticle}
                  onOpenSearch={() => {
                    setIsMobileSidebarOpen(false);
                    setIsSearchOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Article Content Area */}
        <div className="flex-1 flex justify-center">
          {articleData ? (
            <GuideContent
              category={articleData.category}
              article={articleData.article}
              onSelectArticle={handleSelectArticle}
            />
          ) : (
            <div className="p-12 text-center text-white/50 space-y-4">
              <h2 className="font-display text-xl">Topic Not Found</h2>
              <p className="text-xs">The requested guide page could not be located.</p>
              <button
                type="button"
                onClick={() => handleSelectArticle("introduction", "overview")}
                className="px-4 py-2 bg-[#e2efba] text-black text-xs font-bold rounded"
              >
                Return to Guide Overview
              </button>
            </div>
          )}
        </div>

        {/* Right Sticky TOC */}
        <GuideToc sections={articleData?.article?.content?.sections || []} />
      </div>

      {/* Global Search Modal */}
      <GuideSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={handleSelectArticle}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
