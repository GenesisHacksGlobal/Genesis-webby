import React, { useEffect, useState } from "react";

export default function GuideToc({ sections = [] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || "");

  useEffect(() => {
    if (!sections.length) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  if (!sections.length) return null;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="w-64 shrink-0 hidden lg:block sticky top-24 self-start space-y-3 px-4 py-2 border-l border-white/10 text-xs">
      <div className="font-display uppercase text-[11px] tracking-wider text-white/50">
        On this page
      </div>
      <ul className="space-y-2">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <li key={sec.id}>
              <button
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`text-left transition-colors duration-150 leading-relaxed block w-full truncate ${
                  isActive
                    ? "text-[#e2efba] font-medium pl-1 border-l-2 border-[#e2efba]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {sec.title}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
