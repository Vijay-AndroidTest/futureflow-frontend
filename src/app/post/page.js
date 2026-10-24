import { client } from "../../sanity/client";
import { urlFor } from "../../sanity/imageBuilder";
import Link from "next/link";
import LoadMoreGrid from "../../components/LoadMoreGrid";
import { Suspense } from "react";

export async function generateMetadata() {
  const config = await client.fetch(`*[_type == "siteSettings"][0]{ siteName, siteTagline }`);

  return {
    title: `The Archive | ${config?.siteName || "FutureFlow AI"}`,
    description: config?.siteTagline || "Explore practical SEO guides and digital marketing strategies.",
    alternates: {
      canonical: "https://futureflowai.in/post",
    },
  };
}

export default async function PostIndex() {
  const data = await client.fetch(`{
    "posts": *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      readTime,
      description
    },
    "home": *[_type == "homepageSettings"][0]{
        featuredPosts[]->{ _id, title, slug, mainImage, publishedAt, readTime }
    }
  }`);

  const posts = data.posts;
  const featured = data.home?.featuredPosts || [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <Suspense fallback={<div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Archive...</div>}>
        <ArchiveContent posts={posts} featured={featured} />
      </Suspense>
    </main>
  );
}

function ArchiveContent({ posts, featured }) {
  return (
    <>
      <div className="mb-12 md:mb-20">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black brand-header tracking-tight mb-4 text-[#0B1739]">
          The Archive
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl">
          Deep dives into digital marketing, SEO strategies, AI search research, and online growth.
        </p>
      </div>

      {/* Grid of posts with Client-side filtering */}
      <section>
        <LoadMoreGrid initialPosts={posts} featuredPosts={featured} postsPerPage={30} />
      </section>
    </>
  );
}
