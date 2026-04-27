'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { urlFor } from '../sanity/imageBuilder';
import { useSearchParams } from 'next/navigation';

export default function LoadMoreGrid({ initialPosts, featuredPosts = [], postsPerPage = 30 }) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';
  const [visibleCount, setVisibleCount] = useState(postsPerPage);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!search) return initialPosts;
    return initialPosts.filter(post =>
      post.title?.toLowerCase().includes(search) ||
      post.description?.toLowerCase().includes(search)
    );
  }, [search, initialPosts]);

  const hasMore = visibleCount < filteredPosts.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + postsPerPage);
  };

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  return (
    <>
      {/* Featured Section - Only show if not searching */}
      {!search && featuredPosts.length > 0 && (
        <section className="mb-32">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Must Read Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featuredPosts.slice(0, 2).map((post) => (
              <Link href={`/post/${post.slug?.current}`} key={post._id} className="group flex flex-col gap-8">
                <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                  {post.mainImage && (
                    <img
                      src={urlFor(post.mainImage).width(1280).height(720).url()}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-black italic-header italic uppercase leading-tight group-hover:text-[#f08554] transition-colors mb-4">
                    {post.title}
                  </h3>
                  <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                    <span>{post.readTime || 5} Min Read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Results Header */}
      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">
        {search ? `Search Results for "${search}" (${filteredPosts.length})` : "Latest Insights"}
      </h2>

      {filteredPosts.length > 0 ? (
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
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No articles found matching "{search}".</p>
          <Link href="/post" className="text-[#f08554] font-black text-[10px] uppercase tracking-widest mt-6 inline-block hover:underline">View all articles →</Link>
        </div>
      )}

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
