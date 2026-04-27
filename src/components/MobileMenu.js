'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu({ nav, categories }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-900 focus:outline-none"
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white pt-24 px-6 flex flex-col gap-8 overflow-y-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-slate-900"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Nav Items */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Menu</h4>
            {nav?.navItems?.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <Link
                  href={item.link || "#"}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black italic-header italic uppercase text-slate-900"
                >
                  {item.label}
                </Link>
                {item.dropdown && item.dropdown.length > 0 && (
                  <div className="pl-4 flex flex-col gap-3 border-l-2 border-slate-50">
                    {item.dropdown.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.link || "#"}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-bold text-slate-500 uppercase tracking-widest"
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
          <div className="flex flex-col gap-6 pt-8 border-t border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Topics</h4>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/category/${cat.slug.current}`}
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-black text-[#f08554] uppercase tracking-widest bg-orange-50 px-4 py-3 rounded-xl text-center"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-auto pb-12 flex flex-col gap-4">
            <Link
              href="https://seo.futureflowai.in/"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl border border-white/10"
            >
              Free SEO Audit ↗
            </Link>
            {nav?.ctaLabel && (
              <Link
                href={nav.ctaLink || "#"}
                onClick={() => setIsOpen(false)}
                className="block w-full bg-[#f08554] text-white text-center py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-100"
              >
                {nav.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
