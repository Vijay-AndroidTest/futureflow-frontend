'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { urlFor } from '../sanity/imageBuilder';
import { useSearchParams } from 'next/navigation';

export default function LoadMoreGrid({ initialPosts, featuredPosts = [], postsPerPage = 30 }) {
  const searchParams = useSearchParams();
  const rawSearch = searchParams.get('search')?.toLowerCase() || '';

  // Ignore raw template string placeholders from search bots ({search_term_string})
  const isTemplate = rawSearch.includes('{search_term_string}') || rawSearch.includes('%7b');
  const search = isTemplate ? '' : rawSearch.trim();

  const [visibleCount, setVisibleCount] = useState(postsPerPage);

  // Always reset pagination when search query changes
  useEffect(() => {
    setVisibleCount(postsPerPage);
  }, [search, postsPerPage]);

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
        <section className="mb-16 md:mb-32">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-8 sm:mb-12">Must Read Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {featuredPosts.slice(0, 2).map((post) => {
              const category = post.category || post.categories?.[0];
              const categoryTitle = category?.title || "Digital Marketing";
              const categorySlug = category?.slug?.current || "digital-marketing";

              return (
                <div key={post._id} className="group flex flex-col gap-6 sm:gap-8">
                  <Link href={`/post/${post.slug?.current}`} className="aspect-video rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] block bg-slate-900">
                    {post.mainImage && (
                      <img
                        src={urlFor(post.mainImage).width(1280).height(720).url()}
                        alt={post.mainImage.alt || post.mainImage.caption || post.title || 'Must read article image'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </Link>
                  <div>
                    <div className="mb-2">
                      <Link href={`/category/${categorySlug}`} className="text-[#0878F9] text-xs font-black uppercase tracking-widest hover:underline inline-block">
                        {categoryTitle}
                      </Link>
                    </div>
                    <Link href={`/post/${post.slug?.current}`}>
                      <h3 className="text-2xl sm:text-3xl font-black brand-header leading-snug text-[#0B1739] group-hover:text-[#0878F9] transition-colors mb-3 sm:mb-4">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex gap-6 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{post.readTime || 5} Min Read</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Results Header */}
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-8 sm:mb-12">
        {search ? `Search Results for "${search}" (${filteredPosts.length})` : "Latest Insights"}
      </h2>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 sm:gap-y-16">
          {visiblePosts.map((post) => {
            const category = post.category || post.categories?.[0];
            const categoryTitle = category?.title || "Digital Marketing";
            const categorySlug = category?.slug?.current || "digital-marketing";

            return (
              <div
                key={post._id}
                className="group flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-[#0878F9]/30 transition-all"
              >
                <Link href={`/post/${post.slug?.current}`} className="aspect-video overflow-hidden bg-slate-100 block">
                  {post.mainImage && (
                    <img
                      src={urlFor(post.mainImage).width(800).height(450).url()}
                      alt={post.mainImage.alt || post.mainImage.caption || post.title || 'Article thumbnail image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                </Link>
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="mb-3">
                    <Link href={`/category/${categorySlug}`} className="text-[#0878F9] text-xs font-black uppercase tracking-widest hover:underline inline-block">
                      {categoryTitle}
                    </Link>
                  </div>
                  <Link href={`/post/${post.slug?.current}`}>
                    <h3 className="text-lg sm:text-xl font-black leading-snug text-[#0B1739] group-hover:text-[#0878F9] transition-colors mb-3 sm:mb-4 brand-header line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium line-clamp-2 mb-6">
                    {post.description}
                  </p>
                  <div className="mt-auto text-xs font-bold text-slate-600 uppercase tracking-wider border-t pt-4 flex justify-between items-center">
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>{post.readTime || 5} MIN READ</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
          <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No articles found matching "{search}".</p>
          <Link href="/post" className="text-[#0878F9] font-black text-xs uppercase tracking-widest mt-6 inline-block hover:underline">View all articles →</Link>
        </div>
      )}

      {hasMore && (
        <div className="mt-20 flex flex-col items-center">
            <div className="w-full h-px bg-slate-100 mb-8"></div>
            <button
                type="button"
                onClick={loadMore}
                className="px-12 py-4 border-2 border-[#0B1739] rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#0878F9] hover:border-[#0878F9] hover:text-white transition-all shadow-xl shadow-slate-100"
            >
                Load more articles
            </button>
        </div>
      )}
    </>
  );
}
