import { client } from "../../sanity/client";
import { urlFor } from "../../sanity/imageBuilder";
import Link from "next/link";
import LoadMoreGrid from "../../components/LoadMoreGrid";

export async function generateMetadata() {
  const config = await client.fetch(`*[_type == "siteSettings"][0]{ siteName, siteTagline }`);
  return {
    title: `All Articles | ${config?.siteName || "FutureFlow AI"}`,
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
      <div className="mb-20">
        <h1 className="text-5xl md:text-7xl font-black italic-header italic uppercase tracking-tighter mb-4 text-slate-900">
          The Archive
        </h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl">
          Deep dives into AI strategy, automation workflows, and the future of digital creation.
        </p>
      </div>

      {/* Featured Section on Index */}
      {featured.length > 0 && (
        <section className="mb-32">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Must Read Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featured.slice(0, 2).map((post) => (
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

      {/* Grid of all posts */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Latest Insights</h2>
        <LoadMoreGrid initialPosts={posts} postsPerPage={30} />
      </section>
    </main>
  );
}