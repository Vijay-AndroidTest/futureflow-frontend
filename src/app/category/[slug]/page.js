import { client } from "../../../sanity/client";
import { urlFor } from "../../../sanity/imageBuilder";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadMoreGrid from "../../../components/LoadMoreGrid";

export async function generateStaticParams() {
  const categories = await client.fetch(`*[_type == "category"]{ "slug": slug.current }`);
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const data = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0] {
      title,
      description,
      "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        readTime,
        description
      }
    }`,
    { slug: slug }
  );

  if (!data) {
    redirect('/');
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-20 border-b border-slate-100 pb-16">
        <span className="text-[#f08554] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          Category Archive
        </span>
        <h1 className="text-5xl md:text-7xl font-black italic-header italic uppercase tracking-tighter mb-6 text-slate-900">
          {data.title}
        </h1>
        {data.description && (
          <p className="text-slate-500 text-xl font-medium max-w-2xl">
            {data.description}
          </p>
        )}
      </div>

      {data.posts && data.posts.length > 0 ? (
        <LoadMoreGrid initialPosts={data.posts} postsPerPage={30} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest">No articles found in this category.</p>
          <Link href="/" className="mt-8 inline-block bg-[#f08554] text-white px-8 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest">Back to Home</Link>
        </div>
      )}
    </main>
  );
}