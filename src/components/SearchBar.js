'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../sanity/client';
import { urlFor } from '../sanity/imageBuilder';
import Link from 'next/link';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  // Live Search Logic
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await client.fetch(
          `*[_type == "post" && title match $query + "*"] | order(publishedAt desc)[0...5] {
            _id,
            title,
            slug,
            mainImage
          }`,
          { query }
        );
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
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
        <div className="fixed inset-0 z-[200] bg-white flex flex-col p-6 md:p-12 overflow-y-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="self-end p-4 text-slate-900 hover:rotate-90 transition-transform duration-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-4xl mx-auto w-full pt-10">
            <form onSubmit={handleSearch} className="w-full">
              <span className="text-[10px] font-black text-[#f08554] uppercase tracking-[0.5em] mb-4 block">Quick Search</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find articles, tools, or prompts..."
                className="w-full bg-transparent border-b-2 border-slate-900 py-4 text-2xl md:text-4xl font-black italic-header italic uppercase outline-none placeholder:text-slate-100 text-slate-900"
              />
            </form>

            {/* Live Suggestions */}
            <div className="mt-12">
                {loading && <p className="text-[10px] font-black text-slate-400 uppercase animate-pulse">Searching...</p>}

                {!loading && results.length > 0 && (
                    <div className="flex flex-col gap-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4">Top Results</h4>
                        {results.map((post) => (
                            <Link
                                key={post._id}
                                href={`/post/${post.slug.current}`}
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center gap-6"
                            >
                                <div className="w-20 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {post.mainImage && (
                                        <img
                                            src={urlFor(post.mainImage).width(100).height(60).url()}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        />
                                    )}
                                </div>
                                <h3 className="text-lg md:text-xl font-black italic-header italic uppercase text-slate-900 group-hover:text-[#f08554] transition-colors line-clamp-1">
                                    {post.title}
                                </h3>
                            </Link>
                        ))}
                        <button
                            onClick={handleSearch}
                            className="mt-4 text-[10px] font-black text-[#f08554] uppercase tracking-widest hover:underline text-left"
                        >
                            View all results for "{query}" →
                        </button>
                    </div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No results found for "{query}"</p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
