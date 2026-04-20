import Link from "next/link";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/imageBuilder";

export default async function RelatedPosts({ currentSlug }) {
  // Fetch 2 latest posts excluding the current one
  // In a real scenario, you might want to fetch by category
  const posts = await client.fetch(
    `*[_type == "post" && slug.current != $currentSlug] | order(publishedAt desc)[0...2] {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      readTime
    }`,
    { currentSlug }
  );

  if (!posts || posts.length === 0) return null;

  return (
    <>
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/post/${post.slug.current}`}
          className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all"
        >
          <div className="aspect-video w-full overflow-hidden bg-slate-100">
            {post.mainImage && (
              <img
                src={urlFor(post.mainImage).width(600).height(338).url()}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <span className="text-[#f08554] text-[8px] font-black uppercase tracking-widest mb-3 inline-block">Recommended</span>
            <h3 className="text-lg font-black leading-tight text-slate-900 group-hover:text-[#f08554] transition-colors italic-header italic uppercase line-clamp-2">
              {post.title}
            </h3>
          </div>
        </Link>
      ))}
    </>
  );
}
