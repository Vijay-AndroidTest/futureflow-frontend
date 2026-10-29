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
  readTime,
  "category": category->{ title, slug },
  "categories": categories[defined(@)]->{ title, slug }
`;

export default async function Home() {
  const data = await client.fetch(`{
    "home": *[_type == "homepageSettings"][0]{
      ...,
      heroSection { ..., featuredPosts[]->{ ${postFields} } },
      tray1 { ..., posts[]->{ ${postFields} } },
      tray2,
      tray3 { ..., posts[]->{ ${postFields} } },
      tray4 { ..., posts[]->{ ${postFields} } }
    },
    "latestPosts": *[_type == "post"] | order(publishedAt desc) [0...12] {
      ${postFields}
    },
    "categories": *[_type == "category" && defined(slug.current) && defined(title)] | order(title asc) { title, slug, description }
  }`);

  const { home, latestPosts, categories } = data;

  // Logic for Dynamic Sections
  const heroPost = home?.heroSection?.featuredPosts?.[0] || latestPosts?.[0];
  const tray1Posts = home?.tray1?.posts || latestPosts?.slice(0, 4);
  const tray2Posts = latestPosts?.slice(0, 6);

  const tickerItems = home?.tickerItems || [
    { label: 'SEO Strategy', link: '/category/seo' },
    { label: 'Digital Marketing', link: '/category/digital-marketing' },
    { label: 'AI Search & GEO', link: '/category/ai-search' },
    { label: 'Content Strategy', link: '/category/content-marketing' },
    { label: 'Paid Advertising', link: '/category/paid-advertising' }
  ];

  const PostCard = ({ post, size = "md" }: { post: any, size?: "sm" | "md" | "lg" }) => {
    const width = size === "lg" ? 1280 : size === "md" ? 800 : 600;
    const height = Math.round(width * (9/16));

    const catObj = post.category || post.categories?.[0];
    const categoryTitle = catObj?.title || "Digital Marketing";
    const categorySlug = catObj?.slug?.current || "digital-marketing";

    return (
      <div
        key={post._id}
        className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-[#0878F9]/30 transition-all h-full"
      >
        <Link href={`/post/${post.slug?.current}`} className="aspect-video w-full overflow-hidden bg-slate-100 block">
          {post.mainImage && (
            <img
                src={urlFor(post.mainImage).width(width).height(height).auto('format').url()}
                alt={post.mainImage.alt || post.mainImage.caption || post.title || 'Article thumbnail'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
            />
          )}
        </Link>
        <div className="p-6 sm:p-8 flex flex-col flex-grow">
           <div className="mb-3">
             <Link
               href={`/category/${categorySlug}`}
               className="text-[#0878F9] text-xs font-black uppercase tracking-widest hover:underline inline-block"
             >
               {categoryTitle}
             </Link>
           </div>
           <Link href={`/post/${post.slug?.current}`}>
             <h3 className={`${size === "sm" ? "text-lg" : "text-xl"} font-black leading-snug text-[#0B1739] group-hover:text-[#0878F9] transition-colors brand-header line-clamp-2 mb-4`}>
                {post.title}
             </h3>
           </Link>
           <div className="mt-auto flex justify-between items-center text-xs font-bold text-slate-600 uppercase tracking-wider border-t pt-4">
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>{post.readTime || 5} MIN READ</span>
           </div>
        </div>
      </div>
    );
  };

  // Stats from Sanity
  const statsList = [
    { value: home?.statsGuides, label: 'GUIDES' },
    { value: home?.statsStrategies, label: 'STRATEGIES' },
    { value: home?.statsReaders, label: 'READERS' },
  ].filter(stat => stat.value && String(stat.value).trim() !== '');

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* --- HERO SECTION --- */}
        <section className="mb-12 md:mb-20">
          <div className="bg-[#0B1739] rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 p-6 sm:p-10 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
                <span className="text-[#00C7E8] text-[10px] font-black uppercase tracking-[0.4em] mb-4 sm:mb-6 block">The Future of Digital Growth</span>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.02] mb-6 sm:mb-8 brand-header tracking-tight">
                  {home?.heroSection?.headline || "Smarter SEO & Digital Marketing Strategies for Real Growth"}
                </h1>
                <p className="text-slate-300 text-base sm:text-lg mb-8 sm:mb-10 font-medium leading-relaxed max-w-lg">
                  {home?.heroSection?.subtext || "Practical SEO insights, digital marketing strategies, AI search research, and real-world experiments to help websites improve visibility, traffic, and conversions."}
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
                  <Link href={home?.heroSection?.primaryCtaLink || "/post"} className="bg-[#0878F9] text-white px-8 py-4 rounded-xl font-black text-xs hover:bg-[#0660c8] transition-all uppercase tracking-widest shadow-lg shadow-blue-500/20 text-center">
                    {home?.heroSection?.primaryCtaLabel || "Explore Insights"}
                  </Link>
                  <Link href="https://seo.futureflowai.in/" target="_blank" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black text-xs hover:bg-white/10 transition-all uppercase tracking-widest flex items-center justify-center gap-2 text-center">
                    Free SEO Audit ↗
                  </Link>
                </div>

                {/* Render Stats Row Only If Sanity Values Exist */}
                {statsList.length > 0 && (
                  <div className="flex gap-8 sm:gap-10 pt-6 sm:pt-10 border-t border-white/10">
                    {statsList.map((stat, idx) => (
                      <div key={idx}>
                        <div className="text-xl sm:text-2xl font-black text-white brand-header">{stat.value}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 order-1 lg:order-2">
                <Link href={heroPost?.slug ? `/post/${heroPost.slug.current}` : "#"} className="block group">
                  <div className="aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border-4 border-white/5 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] flex items-center justify-center p-2">
                    {heroPost?.mainImage && (
                      <img
                        src={urlFor(heroPost.mainImage).width(1280).fit('max').auto('format').url()}
                        alt={heroPost.mainImage.alt || heroPost.mainImage.caption || heroPost.title || 'Featured hero article cover image'}
                        className="w-full h-full object-contain"
                        loading="eager"
                      />
                    )}
                  </div>
                  {heroPost && (
                    <div className="mt-4 sm:mt-6 flex justify-between items-center px-1 sm:px-2">
                      <span className="text-white font-black text-sm brand-header group-hover:text-[#00C7E8] transition-colors line-clamp-1">
                        Featured: {heroPost.title}
                      </span>
                      <span className="text-xs font-black text-[#0878F9] uppercase tracking-widest shrink-0 ml-4">
                        Read Story →
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- DYNAMIC LIVE MARQUEE TICKER STRIP --- */}
        <div className="mb-16 md:mb-32 overflow-hidden bg-white border-y border-slate-100 py-4 sm:py-6 rounded-xl sm:rounded-2xl">
            <div className="animate-marquee whitespace-nowrap">
                {[...tickerItems, ...tickerItems].map((tagItem: any, idx: number) => {
                    const label = typeof tagItem === 'string' ? tagItem : tagItem.label;
                    const link = typeof tagItem === 'object' && tagItem.link ? tagItem.link : '/post';

                    return (
                      <Link
                        key={idx}
                        href={link}
                        className="mx-6 sm:mx-10 text-xs font-black text-slate-600 hover:text-[#0878F9] uppercase tracking-[0.25em] inline-flex items-center gap-3 sm:gap-4 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-[#0878F9] rounded-full"></span>
                        {label}
                      </Link>
                    );
                })}
            </div>
        </div>

        {/* --- TRAY 1: Editor's Pick --- */}
        {home?.tray1?.enabled !== false && (
            <section className="mb-16 md:mb-32">
            <div className="flex justify-between items-center mb-8 sm:mb-10 px-2 sm:px-4">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1739] brand-header">{home?.tray1?.title || "Editor's Pick"}</h2>
                <div className="h-px flex-grow bg-slate-200 mx-4 sm:mx-8"></div>
                {home?.tray1?.moreLink && <Link href={home.tray1.moreLink} className="text-xs font-black text-[#0878F9] uppercase tracking-widest shrink-0 hover:underline">{home.tray1.moreLabel || "View All →"}</Link>}
            </div>
            <FeaturedSlider featuredPosts={home?.tray1?.posts || tray1Posts} />
            </section>
        )}

        {/* --- TRAY 2: Automatic Latest Posts --- */}
        {home?.tray2?.enabled !== false && (
          <section className="mb-16 md:mb-32">
            <div className="flex justify-between items-center mb-8 sm:mb-12 px-2 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1739] brand-header">{home?.tray2?.title || "Recent Insights"}</h2>
              <Link href="/post" className="text-xs font-black text-[#0878F9] uppercase tracking-widest shrink-0 hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
               {tray2Posts?.map((post: any) => <PostCard key={post._id} post={post} />)}
            </div>
          </section>
        )}

        {/* --- SEO PROMO SECTION (Mid-Page Break) --- */}
        <section className="mb-16 md:mb-32">
          <Link href="https://seo.futureflowai.in/" target="_blank" className="group block relative overflow-hidden rounded-3xl sm:rounded-[3rem] bg-[#0B1739] border border-white/5 p-6 sm:p-10 md:p-12 transition-all hover:border-[#0878F9]/30">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
              <div className="max-w-xl">
                <span className="text-[#00C7E8] text-[10px] font-black uppercase tracking-[0.4em] mb-3 sm:mb-4 block">Specialized Services</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white brand-header tracking-tight mb-3 sm:mb-4">
                  Boost Your Search Visibility with <span className="text-[#00C7E8]">FutureFlow SEO</span>
                </h2>
                <p className="text-slate-300 font-medium text-sm sm:text-lg leading-relaxed">
                  We combine AI-driven insights with expert strategy to help your brand dominate search results. Get a comprehensive site audit today.
                </p>
              </div>
              <div className="bg-[#0878F9] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] group-hover:scale-105 transition-transform shadow-xl shadow-blue-500/20 shrink-0 w-full md:w-auto text-center">
                Get Free SEO Audit →
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C7E8]/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-colors group-hover:bg-[#00C7E8]/20"></div>
          </Link>
        </section>

        {/* --- BROWSE BY TOPIC SECTION (Eliminating Empty Space Before Footer) --- */}
        {categories && categories.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="flex justify-between items-center mb-8 px-2 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0B1739] brand-header">Browse by Topic</h2>
              <div className="h-px flex-grow bg-slate-200 mx-4 sm:mx-8"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((cat: any) => (
                <Link
                  key={cat.slug.current}
                  href={`/category/${cat.slug.current}`}
                  className="group p-5 sm:p-6 rounded-2xl bg-white border border-slate-100 hover:border-[#0878F9] hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0878F9] block mb-2">Topic</span>
                    <h3 className="text-base sm:text-lg font-black brand-header text-[#0B1739] group-hover:text-[#0878F9] transition-colors leading-snug">
                      {cat.title}
                    </h3>
                  </div>
                  <div className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 group-hover:text-[#0878F9]">
                    Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
