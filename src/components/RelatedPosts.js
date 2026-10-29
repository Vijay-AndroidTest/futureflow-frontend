import Link from "next/link";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/imageBuilder";

export default async function RelatedPosts({ currentSlug }) {
  const posts = await client.fetch(
    `*[_type == "post" && slug.current != $currentSlug] | order(publishedAt desc)[0...2] {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      readTime,
      "category": category->{ title, slug },
      "categories": categories[defined(@)]->{ title, slug }
    }`,
    { currentSlug }
  );

  if (!posts || posts.length === 0) return null;

  return (
    <>
      {posts.map((post) => {
        const category = post.category || post.categories?.[0];
        const categoryTitle = category?.title || "Digital Marketing";
        const categorySlug = category?.slug?.current || "digital-marketing";

        return (
          <div
            key={post._id}
            className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-[#0878F9]/30 transition-all"
          >
            <Link href={`/post/${post.slug?.current}`} className="aspect-video w-full overflow-hidden bg-slate-100 block">
              {post.mainImage && (
                <img
                  src={urlFor(post.mainImage).width(600).height(338).url()}
                  alt={post.mainImage.alt || post.mainImage.caption || post.title || 'Related article thumbnail'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-2">
                <Link href={`/category/${categorySlug}`} className="text-[#0878F9] text-xs font-black uppercase tracking-widest hover:underline inline-block">
                  {categoryTitle}
                </Link>
              </div>
              <Link href={`/post/${post.slug?.current}`}>
                <h3 className="text-lg font-black leading-snug text-[#0B1739] group-hover:text-[#0878F9] transition-colors brand-header line-clamp-2">
                  {post.title}
                </h3>
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}
