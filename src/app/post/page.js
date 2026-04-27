import { client } from "../../sanity/client";
import { urlFor } from "../../sanity/imageBuilder";
import Link from "next/link";
import LoadMoreGrid from "../../components/LoadMoreGrid";
import { Suspense } from "react";

export async function generateMetadata() {
  const config = await client.fetch(`*[_type == "siteSettings"][0]{ siteName, siteTagline }`);

  return {
    title: `The Archive | ${config?.siteName || "FutureFlow AI"}`,
    description: config?.siteTagline,
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
    <main className="max-w-7xl mx-auto px-6 py-20">
      <Suspense fallback={<div>Loading Archive...</div>}>
        <ArchiveContent posts={posts} featured={featured} />
      </Suspense>
    </main>
  );
}

function ArchiveContent({ posts, featured }) {
  return (
    <>
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl font-black italic-header italic uppercase tracking-tighter mb-4 text-slate-900">
          The Archive
        </h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl">
          Deep dives into AI strategy, automation workflows, and the future of digital creation.
        </p>
      </div>

      {/* Grid of posts with Client-side filtering */}
      <section>
        <LoadMoreGrid initialPosts={posts} featuredPosts={featured} postsPerPage={30} />
      </section>
    </>
  );
}
