'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileMenu({ nav, categories }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#0B1739] focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 h-20 border-b border-slate-100 flex items-center justify-between shrink-0 z-10">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-black tracking-tighter text-[#0B1739] uppercase italic">
              FUTUREFLOW <span className="text-[#0878F9]">AI</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 text-[#0B1739] hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 flex flex-col gap-8 flex-grow">
            {/* Nav Items */}
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Menu</h4>
              {nav?.navItems?.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <Link
                    href={item.link || "#"}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-black italic-header italic uppercase text-[#0B1739] hover:text-[#0878F9] transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && item.dropdown.length > 0 && (
                    <div className="pl-4 flex flex-col gap-2.5 border-l-2 border-slate-100 my-1">
                      {item.dropdown.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          href={sub.link || "#"}
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-bold text-slate-500 hover:text-[#0878F9] uppercase tracking-widest py-1"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Categories */}
            {categories && (categories || []).filter(cat => cat?.slug?.current && cat?.title).length > 0 && (
              <div className="flex flex-col gap-4 pt-8 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Topics</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(categories || []).filter(cat => cat?.slug?.current && cat?.title).map((cat, idx) => (
                    <Link
                      key={idx}
                      href={`/category/${cat.slug.current}`}
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] font-black text-[#0878F9] uppercase tracking-widest bg-blue-50/80 hover:bg-blue-100/80 px-4 py-3 rounded-xl text-center transition-colors"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-8 pb-8 flex flex-col gap-3">
              <Link
                href="https://seo.futureflowai.in/"
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#0B1739] text-white text-center py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl border border-white/10 active:scale-[0.98] transition-transform"
              >
                Free SEO Audit ↗
              </Link>
              {nav?.ctaLabel && (
                <Link
                  href={nav.ctaLink || "#"}
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-[#0878F9] text-white text-center py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-transform"
                >
                  {nav.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
