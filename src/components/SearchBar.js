'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/post?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
        aria-label="Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-md flex items-center justify-center p-6">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 p-4 text-slate-900 hover:rotate-90 transition-transform duration-300"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <form onSubmit={handleSearch} className="w-full max-w-4xl">
            <span className="text-[10px] font-black text-[#f08554] uppercase tracking-[0.5em] mb-6 block text-center">Search FutureFlow AI</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search articles..."
              className="w-full bg-transparent border-b-4 border-slate-900 py-6 text-4xl md:text-7xl font-black italic-header italic uppercase outline-none placeholder:text-slate-100 text-slate-900"
            />
            <div className="mt-8 flex justify-center gap-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Press Enter to search</p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
