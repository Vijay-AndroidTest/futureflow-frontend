'use client';

import { useState, useEffect } from 'react';

export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -65% 0px',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length < 2) return null;

  const scrollToHeading = (e, slug) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (el) {
      const topOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(slug);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="my-8 rounded-2xl md:rounded-3xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0878F9] text-xs font-black text-white shadow-sm">
            ≡
          </span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0878F9] block">
              Quick Navigation
            </span>
            <h3 className="text-base sm:text-lg font-black brand-header text-[#0B1739]">
              Table of Contents
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-slate-500 hover:text-[#0B1739] flex items-center gap-1.5 uppercase tracking-wider py-1 px-2 rounded-lg hover:bg-slate-200/50 transition-colors"
          aria-expanded={isOpen}
          aria-label="Toggle Table of Contents"
        >
          <span>{isOpen ? 'Hide' : 'Show'}</span>
          <span className={`text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <nav className="mt-5 pt-4 border-t border-slate-200/70 flex flex-col gap-2">
          {headings.map((heading, idx) => {
            const isActive = activeId === heading.slug;
            const isH3 = heading.level === 3;

            return (
              <a
                key={idx}
                href={`#${heading.slug}`}
                onClick={(e) => scrollToHeading(e, heading.slug)}
                className={`group flex items-start gap-2.5 py-1.5 text-sm transition-all rounded-lg px-2 ${
                  isH3 ? 'ml-4 text-xs' : 'font-semibold'
                } ${
                  isActive
                    ? 'text-[#0878F9] font-bold bg-blue-50/80'
                    : 'text-slate-600 hover:text-[#0B1739] hover:bg-slate-100/60'
                }`}
              >
                <span
                  className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 transition-all ${
                    isActive ? 'bg-[#0878F9] scale-125' : 'bg-slate-300 group-hover:bg-slate-500'
                  }`}
                />
                <span className="leading-snug">{heading.text}</span>
              </a>
            );
          })}

          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Audit Tool
            </span>
            <a
              href="https://seo.futureflowai.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0878F9] hover:underline font-bold text-xs uppercase tracking-wider flex items-center gap-1"
            >
              Analyze Your URL Free ↗
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}
