'use client';

import { useState } from 'react';
import Link from 'next/link';
import { urlFor } from '../sanity/imageBuilder';

export default function LoadMoreGrid({ initialPosts, postsPerPage = 30 }) {
  const [visibleCount, setVisibleCount] = useState(postsPerPage);

  const hasMore = visibleCount < initialPosts.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + postsPerPage);
  };

  const visiblePosts = initialPosts.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {visiblePosts.map((post) => (
          <Link
            href={`/post/${post.slug?.current}`}
            key={post._id}
            className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all"
          >
            <div className="aspect-video overflow-hidden bg-slate-100">
              {post.mainImage && (
                <img
                  src={urlFor(post.mainImage).width(800).height(450).url()}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
            </div>
            <div className="p-8">
              <h3 className="text-xl font-black leading-tight text-slate-900 group-hover:text-[#f08554] transition-colors mb-4 italic-header italic uppercase line-clamp-2">
                {post.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                {post.description}
              </p>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t pt-4">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {post.readTime || 5} MIN READ
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="mt-20 flex flex-col items-center">
            <div className="w-full h-px bg-slate-100 mb-8"></div>
            <button
                onClick={loadMore}
                className="px-12 py-4 border-2 border-slate-900 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-100"
            >
                Load more articles
            </button>
        </div>
      )}
    </>
  );
}
