import { client } from "../sanity/client";
import FeaturedSlider from "../components/FeaturedSlider";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";

const postFields = `
  _id,
  title,
  mainImage {
    ...,
    asset->{
      ...,
      metadata
    }
  },
  slug,
  publishedAt,
  description,
  readTime
`;

export default async function Home() {
  const data = await client.fetch(`{
    "home": *[_type == "homepageSettings"][0]{
      heroSection,
      tray1,
      tray2,
      tray3,
      tray4,
      tickerItems,
      statsReaders
    },
    "latestPosts": *[_type == "post"] | order(publishedAt desc) [0...12] {
      ${postFields}
    }
  }`);

  const { home, latestPosts } = data;

  // Logic for Dynamic Sections
  const heroPost = home?.heroSection?.featuredPost?.[0] || latestPosts?.[0];
  const tray1Posts = home?.tray1?.posts || latestPosts?.slice(0, 4);
  const tray2Posts = latestPosts?.slice(0, 6); // Latest 6 for automatic Tray 2

  const PostCard = ({ post, size = "md" }: { post: any, size?: "sm" | "md" | "lg" }) => {
    const width = size === "lg" ? 1280 : size === "md" ? 800 : 600;
    const height = Math.round(width * (9/16));

    return (
      <Link
        href={`/post/${post.slug?.current}`}
        key={post._id}
        className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all h-full"
      >
        <div className="aspect-video w-full overflow-hidden bg-slate-100">
          {post.mainImage && (
            <img
                src={urlFor(post.mainImage).width(width).height(height).auto('format').url()}
                alt={post.mainImage.alt || post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                style={{
                  backgroundImage: `url(${post.mainImage.asset?.metadata?.lqip})`,
                  backgroundSize: 'cover'
                }}
            />
          )}
        </div>
        <div className="p-8 flex flex-col flex-grow">
           <span className="text-[#f08554] text-[9px] font-black uppercase tracking-widest mb-4 inline-block">INSIGHT</span>
           <h3 className={`${size === "sm" ? "text-lg" : "text-xl"} font-black leading-tight text-slate-900 group-hover:text-[#f08554] transition-colors italic-header italic uppercase line-clamp-2 mb-4`}>
              {post.title}
           </h3>
           <div className="mt-auto flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t pt-4">
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{post.readTime || 5} min read</span>
           </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HERO SECTION --- */}
        <section className="mb-20">
          <div className="bg-[#2d2d35] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
                <span className="text-[#f08554] text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">The Future of Intelligence</span>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95] mb-8 italic-header italic uppercase tracking-tighter">
                  {home?.heroSection?.headline || "Master AI. Rank faster. Build more."}
                </h1>
                <p className="text-slate-400 text-lg mb-10 font-medium leading-relaxed max-w-lg">
                  {home?.heroSection?.subtext || "The best AI tools, battle-tested prompts, and SEO workflows curated for you."}
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                  <Link href={home?.heroSection?.primaryCtaLink || "/post"} className="bg-[#f08554] text-white px-8 py-4 rounded-xl font-black text-[10px] hover:brightness-110 transition-all uppercase tracking-widest shadow-lg shadow-orange-500/20">
                    {home?.heroSection?.primaryCtaLabel || "Explore tools"}
                  </Link>
                  <Link href={home?.heroSection?.secondaryCtaLink || "/post"} className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black text-[10px] hover:bg-white/10 transition-all uppercase tracking-widest">
                    {home?.heroSection?.secondaryCtaLabel || "Browse guides"}
                  </Link>
                </div>
                <div className="flex gap-10 pt-10 border-t border-white/5">
                   <div><div className="text-2xl font-black text-white italic-header italic">142</div><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">PROMPTS</div></div>
                   <div><div className="text-2xl font-black text-white italic-header italic">48</div><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">REVIEWS</div></div>
                   <div><div className="text-2xl font-black text-white italic-header italic">{home?.statsReaders || "31K"}</div><div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">READERS</div></div>
                </div>
              </div>
              <div className="lg:col-span-6 order-1 lg:order-2">
                <Link href={heroPost?.slug ? `/post/${heroPost.slug.current}` : "#"} className="block group">
                  <div className="aspect-video rounded-3xl overflow-hidden bg-slate-800 border-4 border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    {heroPost?.mainImage && (
                      <img src={urlFor(heroPost.mainImage).width(1280).height(720).auto('format').url()} alt={heroPost.mainImage.alt || heroPost.title} className="w-full h-full object-cover" loading="eager" style={{ backgroundImage: `url(${heroPost.mainImage.asset?.metadata?.lqip})`, backgroundSize: 'cover' }} />
                    )}
                  </div>
                  {heroPost && <div className="mt-6 flex justify-between items-center px-2"><span className="text-white font-black text-xs uppercase italic-header italic group-hover:text-[#f08554] transition-colors">Featured: {heroPost.title}</span><span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Read Story →</span></div>}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- TICKER --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-32 max-w-5xl mx-auto">
          {(home?.tickerItems || ['AI Tools', 'Prompts', 'SEO & Growth', 'Make Money', 'Guides']).map((tag: string) => (
            <span key={tag} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-[#f08554] hover:text-[#f08554] transition-all cursor-pointer shadow-sm">{tag}</span>
          ))}
        </div>

        {/* --- TRAY 1: Editor's Choice (Manual) --- */}
        {home?.tray1?.enabled && (
            <section className="mb-32">
            <div className="flex justify-between items-center mb-10 px-4">
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic-header italic">{home.tray1.title || "Editor's Choice"}</h2>
                <div className="h-px flex-grow bg-slate-200 mx-8"></div>
                {home.tray1.moreLink && <Link href={home.tray1.moreLink} className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">{home.tray1.moreLabel || "View All →"}</Link>}
            </div>
            <FeaturedSlider featuredPosts={home.tray1.posts || tray1Posts} />
            </section>
        )}

        {/* --- TRAY 2: Automatic Latest Posts --- */}
        {home?.tray2?.enabled && (
          <section className="mb-32">
            <div className="flex justify-between items-center mb-12 px-4">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic-header italic">{home?.tray2?.title || "Latest Stories"}</h2>
              <Link href="/post" className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {tray2Posts?.map((post: any) => <PostCard key={post._id} post={post} />)}
            </div>
          </section>
        )}

        {/* --- TRAY 3: Manual / Optional --- */}
        {home?.tray3?.enabled && (
          <section className="mb-32">
            <div className="flex justify-between items-center mb-12 px-4">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic-header italic">{home?.tray3?.title || "Must Read"}</h2>
              <div className="h-px flex-grow bg-slate-100 mx-8"></div>
              {home?.tray3?.moreLink && <Link href={home.tray3.moreLink} className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">{home.tray3.moreLabel || "Explore →"}</Link>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {(home.tray3.posts || []).map((post: any) => <PostCard key={post._id} post={post} size="sm" />)}
            </div>
          </section>
        )}

        {/* --- TRAY 4: Manual / Optional --- */}
        {home?.tray4?.enabled && (
          <section className="mb-32">
            <div className="flex justify-between items-center mb-12 px-4">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic-header italic">{home?.tray4?.title || "Deep Dives"}</h2>
              <div className="h-px flex-grow bg-slate-100 mx-8"></div>
              {home?.tray4?.moreLink && <Link href={home.tray4.moreLink} className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">{home.tray4.moreLabel || "Explore →"}</Link>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {(home.tray4.posts || []).map((post: any) => <PostCard key={post._id} post={post} size="sm" />)}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
