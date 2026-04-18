import { client } from "../sanity/client";
import FeaturedSlider from "../components/FeaturedSlider";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";

export const revalidate = 0;

export default async function Home() {
  const data = await client.fetch(`{
    "settings": *[_type == "siteSettings"][0]{
      ...,
      "featuredContent": featuredContent[]->{ _id, title, mainImage, slug, publishedAt }
    },
    "posts": *[_type == "post"] | order(publishedAt desc)
  }`);

  const { settings, posts } = data;
  const featuredIds = settings?.featuredContent?.map((p: any) => p._id) || [];
  const gridPosts = posts?.filter((p: any) => !featuredIds.includes(p._id)) || [];

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <main className="max-w-7xl mx-auto px-6">
        
        {/* --- HERO SECTION --- */}
        <header className="py-20 md:py-28 border-b border-slate-200 mb-16">
          <h1 className="text-5xl md:text-8xl font-[900] tracking-tighter text-slate-900 leading-[0.9] mb-10">
            {settings?.heroTitle || "Discover & Compare the Best AI Tools."}
          </h1>
          
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">Quick Access:</span>
            {settings?.trendingSearches?.map((tag: string, i: number) => (
              <span key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* --- FEATURED SLIDER SECTION --- */}
        {settings?.featuredContent?.length > 0 && (
          <section className="relative z-10">
            <FeaturedSlider featuredPosts={settings.featuredContent} />
          </section>
        )}

        {/* --- LATEST ADDITIONS HEADER --- */}
        <div className="flex items-center justify-between mb-12 mt-20">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 whitespace-nowrap">
            Latest Database Additions
          </h2>
          <div className="h-px w-full ml-8 bg-slate-200 hidden md:block"></div>
        </div>

        {/* --- TOOLS GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-24">
          {gridPosts.map((post: any) => (
            <Link href={`/post/${post.slug?.current}`} key={post._id} className="group flex flex-col h-full">
              <article className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                
                {/* Image Wrap */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  {post.mainImage && (
                    <img 
                      src={urlFor(post.mainImage).width(600).url()} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={post.title} 
                    />
                  )}
                </div>

                {/* Text Content */}
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-6">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Index Year</span>
                      <span className="text-xs font-bold text-slate-900">{new Date(post.publishedAt).getFullYear()}</span>
                    </div>
                    <span className="text-blue-600 font-black text-xs group-hover:translate-x-2 transition-transform">
                      EXPLORE →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}