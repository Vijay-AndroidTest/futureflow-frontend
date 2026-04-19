import { client } from "../sanity/client";
import FeaturedSlider from "../components/FeaturedSlider";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";

export default async function Home() {
  const data = await client.fetch(`{
    "settings": *[_type == "siteSettings"][0]{
      ...,
      "featuredContent": featuredContent[]->{ _id, title, mainImage, slug, publishedAt, excerpt }
    },
    "posts": *[_type == "post"] | order(publishedAt desc)
  }`);

  const { settings, posts } = data;

  // Featured posts for the new slider
  const featuredPosts = settings?.featuredContent || posts?.slice(0, 3);

  // Editorial grid logic
  const heroPost = posts?.[0];
  const sidePosts = posts?.slice(1, 4);
  const storyGridPosts = posts?.slice(4, 8);
  const latestArticles = posts?.slice(8, 12);

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- DYNAMIC HERO SECTION (Editorial Layout) --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          
          {/* Main Hero Story */}
          <div className="lg:col-span-7 bg-[#4a4a55] rounded-3xl p-10 md:p-16 text-white relative overflow-hidden flex flex-col justify-end min-h-[600px] group">
            {settings?.showAnnouncementBar && (
              <div className="absolute top-10 left-10 z-10">
                 <span className="px-3 py-1 bg-[#f08554] text-[10px] font-black uppercase tracking-widest rounded">
                   {settings.announcementText || "UPDATE NOW →"}
                 </span>
              </div>
            )}
            <div className="relative z-10 max-w-lg">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 italic">
                {settings?.heroHeadline || "Master AI. Rank faster. Build more."}
              </h1>
              <p className="text-slate-300 text-lg mb-10 font-medium leading-relaxed">
                {settings?.heroSubtitle || "The best AI tools, battle-tested prompts, and SEO workflows — curated weekly for creators and marketers."}
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all uppercase tracking-widest">Explore tools</button>
                <button className="bg-white/10 backdrop-blur text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-white/20 transition-all border border-white/10 uppercase tracking-widest">Browse all guides</button>
              </div>

              <div className="flex gap-12 mt-16 pt-10 border-t border-white/10">
                 <div>
                   <div className="text-2xl font-black italic tracking-tighter">142</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PROMPTS OPS</div>
                 </div>
                 <div>
                   <div className="text-2xl font-black italic tracking-tighter">48</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TOOL REVIEWS</div>
                 </div>
                 <div>
                   <div className="text-2xl font-black italic tracking-tighter">31K</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">READERS</div>
                 </div>
              </div>
            </div>
            {heroPost?.mainImage && (
              <img src={urlFor(heroPost.mainImage).width(1280).height(720).url()} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" alt="" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>

          {/* Sidebar Featured Stories */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Featured THIS WEEK</h4>
            {sidePosts?.map((post: any) => (
              <Link href={`/post/${post.slug?.current}`} key={post._id} className="group flex gap-6 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-xl transition-all h-full overflow-hidden">
                <div className="w-1/3 aspect-[1280/720] overflow-hidden rounded-xl bg-slate-100">
                  {post.mainImage && (
                    <img src={urlFor(post.mainImage).width(640).height(360).url()} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  )}
                </div>
                <div className="w-2/3 flex flex-col justify-center">
                   <span className="text-[#f08554] text-[9px] font-black uppercase tracking-widest mb-2">FEATURED</span>
                   <h3 className="text-lg font-black leading-tight text-slate-900 group-hover:text-[#f08554] transition-colors line-clamp-2 italic">{post.title}</h3>
                   <div className="mt-3 text-[9px] font-bold text-slate-400 uppercase flex gap-4">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>5 min read</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- NEW AUTO-ROLL FEATURED SLIDER --- */}
        <section className="mb-32">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Editor's Choice</h2>
              <div className="h-px flex-grow bg-slate-100 mx-8"></div>
           </div>
           <FeaturedSlider featuredPosts={featuredPosts} />
        </section>

        {/* --- TAG CLOUD --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-32 max-w-3xl mx-auto">
          {(settings?.trendingTags || ['All topics', 'AI Tools', 'Prompts', 'SEO & Growth']).map((tag: string) => (
            <span key={tag} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-[#f08554] hover:text-[#f08554] transition-all cursor-pointer shadow-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* --- TOP STORIES (Grid Layout) --- */}
        <section className="mb-32">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Top stories</h2>
            <Link href="#" className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">Read All →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {storyGridPosts?.map((post: any, i: number) => (
                <Link
                  href={`/post/${post.slug?.current}`}
                  key={post._id}
                  className={`group relative overflow-hidden rounded-3xl ${i === 0 ? "md:col-span-2 md:row-span-2 min-h-[500px]" : "min-h-[250px] md:col-span-1"}`}
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-80"></div>
                  {post.mainImage && (
                    <img src={urlFor(post.mainImage).width(1280).height(720).url()} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                  )}
                  <div className="absolute bottom-8 left-8 right-8 z-20">
                     <span className="text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-white/10 backdrop-blur rounded mb-4 inline-block uppercase">TRENDING</span>
                     <h3 className={`text-white font-black leading-tight ${i === 0 ? "text-3xl" : "text-lg"} group-hover:text-[#f08554] transition-colors italic`}>{post.title}</h3>
                  </div>
                </Link>
             ))}
          </div>
        </section>

        {/* --- LATEST ARTICLES --- */}
        <section className="pb-24">
           <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Latest articles</h2>
            <Link href="#" className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">Archive →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestArticles?.map((post: any) => (
              <Link href={`/post/${post.slug?.current}`} key={post._id} className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all">
                <div className="aspect-[1280/720] overflow-hidden bg-slate-100">
                  {post.mainImage && (
                    <img src={urlFor(post.mainImage).width(1280).height(720).url()} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  )}
                </div>
                <div className="p-8">
                   <span className="text-[#f08554] text-[9px] font-black uppercase tracking-widest mb-4 inline-block">TUTORIAL</span>
                   <h3 className="text-xl font-black leading-tight text-slate-900 group-hover:text-[#f08554] transition-colors mb-6 italic">{post.title}</h3>
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t pt-4">
                     {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- GLOBAL CTA SECTION --- */}
        <section className="bg-[#4a4a55] rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
           <div className="relative z-10 max-w-2xl mx-auto">
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8 italic">
               {settings?.ctaTitle || "Master AI with our curated directory"}
             </h2>
             <p className="text-slate-300 mb-12 text-lg font-medium leading-relaxed">
               {settings?.ctaSubtitle || "Access the world's most comprehensive database of AI tools, prompts, and SEO workflows. Updated daily by our experts."}
             </p>

             <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
               <Link
                href={settings?.ctaLink || "/tools"}
                className="bg-[#f08554] text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-orange-950/20 text-sm"
               >
                 {settings?.ctaButtonText || "Explore All Tools →"}
               </Link>
               <Link
                href="/guides"
                className="bg-white/10 backdrop-blur text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 text-sm"
               >
                 View Guides
               </Link>
             </div>

             <p className="mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {settings?.ctaFooterText || "50+ New Tools Added This Week"}
             </p>
           </div>
           <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 opacity-10 blur-[150px] -mr-48 -mt-48"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 opacity-10 blur-[150px] -ml-48 -mb-48"></div>
        </section>

      </main>
    </div>
  );
}