import { client } from "../sanity/client";
import FeaturedSlider from "../components/FeaturedSlider";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";

export default async function Home() {
  const data = await client.fetch(`{
    "home": *[_type == "homepageSettings"][0]{
      heroHeadline,
      heroSubtext,
      readAllLink,
      archiveLink,
      featuredPosts[]->{
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
      },
      traySection1[]->{
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
      },
      traySection2[]->{
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
      },
      tickerItems,
      statsReaders
    },
    "latestPosts": *[_type == "post"] | order(publishedAt desc) [0...12] {
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
    }
  }`);

  const { home, latestPosts } = data;

  // Use first featured post or latest for the Hero
  const heroPost = home?.featuredPosts?.[0] || latestPosts?.[0];
  const tray1 = home?.traySection1 || latestPosts?.slice(0, 4);
  const tray2 = home?.traySection2 || latestPosts?.slice(4, 10);

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- NEW CLEAN HERO BOX DESIGN --- */}
        <section className="mb-20">
          <div className="bg-[#2d2d35] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Text Side */}
              <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
                <span className="text-[#f08554] text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">
                  The Future of Intelligence
                </span>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95] mb-8 italic-header italic uppercase tracking-tighter">
                  {home?.heroHeadline || "Master AI. Rank faster. Build more."}
                </h1>

                <p className="text-slate-400 text-lg mb-10 font-medium leading-relaxed max-w-lg">
                  {home?.heroSubtext || "The best AI tools, battle-tested prompts, and SEO workflows curated for you."}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <Link href={home?.readAllLink || "/post"} className="bg-[#f08554] text-white px-8 py-4 rounded-xl font-black text-[10px] hover:brightness-110 transition-all uppercase tracking-widest shadow-lg shadow-orange-500/20">
                    Explore tools
                  </Link>
                  <Link href={home?.archiveLink || "/post"} className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black text-[10px] hover:bg-white/10 transition-all uppercase tracking-widest">
                    Browse guides
                  </Link>
                </div>

                {/* Hero Stats */}
                <div className="flex gap-10 pt-10 border-t border-white/5">
                   <div>
                     <div className="text-2xl font-black text-white italic-header italic">142</div>
                     <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">PROMPTS</div>
                   </div>
                   <div>
                     <div className="text-2xl font-black text-white italic-header italic">48</div>
                     <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">REVIEWS</div>
                   </div>
                   <div>
                     <div className="text-2xl font-black text-white italic-header italic">{home?.statsReaders || "31K"}</div>
                     <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">READERS</div>
                   </div>
                </div>
              </div>

              {/* Image Side - Strictly 16:9 Frame */}
              <div className="lg:col-span-6 order-1 lg:order-2">
                <Link href={heroPost?.slug ? `/post/${heroPost.slug.current}` : "#"} className="block group">
                  <div className="aspect-video rounded-3xl overflow-hidden bg-slate-800 border-4 border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    {heroPost?.mainImage && (
                      <img
                        src={urlFor(heroPost.mainImage).width(1280).height(720).auto('format').url()}
                        alt={heroPost.mainImage.alt || heroPost.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                        style={{
                          backgroundImage: `url(${heroPost.mainImage.asset?.metadata?.lqip})`,
                          backgroundSize: 'cover'
                        }}
                      />
                    )}
                  </div>
                  {heroPost && (
                    <div className="mt-6 flex justify-between items-center px-2">
                       <span className="text-white font-black text-xs uppercase italic-header italic group-hover:text-[#f08554] transition-colors">
                         Featured: {heroPost.title}
                       </span>
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Read Story →</span>
                    </div>
                  )}
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* --- TICKER / TAGS AREA --- */}
        <div className="flex flex-wrap justify-center gap-3 mb-32 max-w-5xl mx-auto">
          {(home?.tickerItems || ['AI Tools', 'Prompts', 'SEO & Growth', 'Make Money', 'Guides']).map((tag: string) => (
            <span key={tag} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-[#f08554] hover:text-[#f08554] transition-all cursor-pointer shadow-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* --- EDITOR'S CHOICE SLIDER --- */}
        <section className="mb-32">
           <div className="flex justify-between items-center mb-10 px-4">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic-header italic">Editor's Choice</h2>
              <div className="h-px flex-grow bg-slate-200 mx-8"></div>
           </div>
           <FeaturedSlider featuredPosts={tray1} />
        </section>

        {/* --- TOP STORIES GRID - Fixed Ratios --- */}
        <section className="mb-32">
          <div className="flex justify-between items-center mb-12 px-4">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic-header italic">Top stories</h2>
            <Link href={home?.readAllLink || "/post"} className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">Read All →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {tray2?.slice(0, 6).map((post: any) => (
                <Link
                  href={`/post/${post.slug?.current}`}
                  key={post._id}
                  className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all"
                >
                  <div className="aspect-video w-full overflow-hidden bg-slate-100">
                    {post.mainImage && (
                      <img
                          src={urlFor(post.mainImage).width(800).height(450).auto('format').url()}
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
                  <div className="p-8">
                     <span className="text-[#f08554] text-[9px] font-black uppercase tracking-widest mb-4 inline-block">TRENDING</span>
                     <h3 className="text-xl font-black leading-tight text-slate-900 group-hover:text-[#f08554] transition-colors italic-header italic uppercase line-clamp-2">
                        {post.title}
                     </h3>
                     <div className="mt-6 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t pt-4">
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>{post.readTime || 5} min read</span>
                     </div>
                  </div>
                </Link>
             ))}
          </div>
        </section>

        {/* --- LATEST ARTICLES --- */}
        <section className="pb-24">
           <div className="flex justify-between items-center mb-12 px-4">
            <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic-header italic">Latest articles</h2>
            <Link href={home?.archiveLink || "/post"} className="text-[10px] font-black text-[#f08554] uppercase tracking-widest">Archive →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestPosts?.slice(0, 4).map((post: any) => (
              <Link href={`/post/${post.slug?.current}`} key={post._id} className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all">
                <div className="aspect-video overflow-hidden bg-slate-100">
                  {post.mainImage && (
                    <img
                        src={urlFor(post.mainImage).width(600).height(338).auto('format').url()}
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
                <div className="p-8">
                   <span className="text-[#f08554] text-[9px] font-black uppercase tracking-widest mb-4 inline-block">INSIGHT</span>
                   <h3 className="text-lg font-black leading-tight text-slate-900 group-hover:text-[#f08554] transition-colors mb-6 italic-header italic uppercase line-clamp-2">{post.title}</h3>
                   <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest border-t pt-4">
                     {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {post.readTime || 5} MIN
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}