import { client } from "../sanity/client";
import FeaturedSlider from "../components/FeaturedSlider";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";

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
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6">
        
        {/* --- PREMIUM HERO SECTION --- */}
        <header className="py-24 md:py-40 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live: AI Index v4.0</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-[800] tracking-tight text-slate-900 leading-[0.95] mb-10 text-gradient">
            {settings?.heroTitle || "Discover & Compare the Best AI Tools."}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Explore 1,000+ vetted AI tools to supercharge your workflow. Built for founders, creators, and engineers.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-full mb-4">Trending Searches:</span>
            {settings?.trendingSearches?.map((tag: string, i: number) => (
              <span key={i} className="px-6 py-3 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* --- FEATURED SLIDER SECTION --- */}
        {settings?.featuredContent?.length > 0 && (
          <section className="relative z-10 mb-32">
            <FeaturedSlider featuredPosts={settings.featuredContent} />
          </section>
        )}

        {/* --- LATEST ADDITIONS HEADER --- */}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-600 mb-4">
            Latest Database Additions
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
        </div>

        {/* --- TOOLS GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {gridPosts.map((post: any) => (
            <Link href={`/post/${post.slug?.current}`} key={post._id} className="group flex flex-col h-full">
              <article className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden card-shadow card-hover flex flex-col h-full">
                
                {/* Image Wrap */}
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  {post.mainImage && (
                    <img 
                      src={urlFor(post.mainImage).width(600).url()} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={post.title} 
                    />
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                      Tool Index
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-6">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Entry Date</span>
                      <span className="text-[11px] font-bold text-slate-900">{new Date(post.publishedAt).getFullYear()}</span>
                    </div>

                    <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                      <span className="text-slate-900 font-bold text-[10px] uppercase tracking-widest">
                        View Review
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
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