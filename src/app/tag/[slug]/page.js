import { client } from "../../../sanity/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import LoadMoreGrid from "../../../components/LoadMoreGrid";
import { Suspense } from "react";

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post" && defined(tags)]{ "tags": tags }`);
  const tagSlugs = new Set();
  (posts || []).forEach(post => {
    (post.tags || []).forEach((tag) => {
      if (tag && typeof tag === 'string') {
        const slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (slug) tagSlugs.add(slug);
      }
    });
  });
  return Array.from(tagSlugs).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const rawTag = slug ? slug.replace(/-/g, ' ') : '';
  const siteConfig = await client.fetch(`*[_type == "siteSettings"][0]{ siteName }`);
  const baseUrl = "https://futureflowai.in";

  return {
    title: `Articles tagged #${rawTag} | ${siteConfig?.siteName || "FutureFlow AI"}`,
    description: `Explore practical digital marketing guides, SEO strategies, and insights tagged with #${rawTag}.`,
    alternates: {
      canonical: `${baseUrl}/tag/${slug}`,
    },
  };
}

export default async function TagPage({ params }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const rawTag = slug.replace(/-/g, ' ');

  // Fetch posts where tag array contains matching string (case-insensitive)
  const posts = await client.fetch(
    `*[_type == "post" && defined(slug.current) && count((tags[])[lower(@) match lower($rawTag)]) > 0] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      readTime,
      description,
      tags,
      "category": category->{ title, slug },
      "categories": categories[defined(@)]->{ title, slug }
    }`,
    { rawTag }
  );

  const displayTag = slug.replace(/-/g, ' ').toUpperCase();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="mb-12 md:mb-20 border-b border-slate-100 pb-12 md:pb-16">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/post" className="text-xs font-bold text-slate-400 hover:text-[#0B1739] uppercase tracking-widest transition-colors">
            Archive
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#0878F9] text-[10px] font-black uppercase tracking-[0.4em]">
            Topic Tag
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black brand-header tracking-tight mb-4 text-[#0B1739]">
          #{displayTag}
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl">
          Showing {posts.length} article{posts.length === 1 ? '' : 's'} tagged with #{displayTag}.
        </p>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading articles...</div>}>
        {posts && posts.length > 0 ? (
          <LoadMoreGrid initialPosts={posts} postsPerPage={30} />
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No articles found tagged with #{displayTag}.</p>
            <Link href="/post" className="mt-8 inline-block bg-[#0878F9] hover:bg-[#0660c8] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors">
              Browse All Articles
            </Link>
          </div>
        )}
      </Suspense>
    </main>
  );
}
