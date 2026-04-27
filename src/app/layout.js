import "./globals.css";
import Link from "next/link";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/imageBuilder";
import MobileMenu from "../components/MobileMenu";
import SearchBar from "../components/SearchBar";

export async function generateMetadata() {
  const config = await client.fetch(`*[_type == "siteSettings"][0]{ defaultSeoTitle, defaultSeoDescription, favicon }`);
  const baseUrl = "https://futureflowai.in";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: config?.defaultSeoTitle || "FutureFlow AI",
      template: `%s | ${config?.siteName || "FutureFlow AI"}`
    },
    description: config?.defaultSeoDescription,
    alternates: {
      canonical: "./",
    },
    openGraph: {
      title: config?.defaultSeoTitle || "FutureFlow AI",
      description: config?.defaultSeoDescription,
      url: baseUrl,
      siteName: config?.siteName || "FutureFlow AI",
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config?.defaultSeoTitle || "FutureFlow AI",
      description: config?.defaultSeoDescription,
    },
    icons: {
      icon: config?.favicon ? urlFor(config.favicon).url() : "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }) {
  // Fetch Singletons and Categories
  const categories = await client.fetch(`*[_type == "category"] | order(title asc) { title, slug }`);
  const nav = await client.fetch(`*[_type == "navigationSettings"][0]`, {}, { next: { revalidate: 60 } });
  const config = await client.fetch(`*[_type == "siteSettings"][0]{
    siteName,
    logo,
    favicon,
    showAnnouncement,
    announcementBar,
    footerTagline,
    siteTagline,
    footerLinks,
    footerCopyright,
    googleAnalyticsId
  }`, {}, { next: { revalidate: 60 } });

  const faviconUrl = config?.favicon ? urlFor(config.favicon).width(32).height(32).auto('format').url() : "/favicon.ico";

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconUrl} />
        {config?.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen">
        {/* Announcement Bar */}
        {nav?.showAnnouncement && (
          <div className="bg-[#f08554] text-white py-2 text-center text-[10px] font-black uppercase tracking-[0.2em]">
            {nav.announcementBar}
          </div>
        )}

        {/* Main Navigation */}
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 h-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              {config?.logo ? (
                <img src={urlFor(config.logo).height(40).url()} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <span className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">
                  {config?.siteName?.toUpperCase().replace(/\bAI\b/g, '').trim() || "FUTUREFLOW"} <span className="text-[#f08554]">AI</span>
                </span>
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              {nav?.navItems?.map((item, idx) => (
                <div key={idx} className="relative group/menu">
                  <Link href={item.link || "#"} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all flex items-center gap-1">
                    {item.label}
                    {item.dropdown && item.dropdown.length > 0 && (
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && item.dropdown.length > 0 && (
                    <div className="absolute top-full left-0 pt-4 hidden group-hover/menu:block min-w-[200px] z-50">
                      <div className="bg-white border border-slate-100 shadow-2xl rounded-xl p-4 flex flex-col gap-3">
                        {item.dropdown.map((sub, sIdx) => (
                          <Link key={sIdx} href={sub.link || "#"} className="text-[10px] font-bold text-slate-400 hover:text-[#f08554] uppercase tracking-widest transition-colors block py-1">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {nav?.ctaLabel && (
                <Link href={nav.ctaLink || "#"} className="bg-[#f08554] text-white px-6 py-2.5 rounded-lg text-[10px] font-black hover:brightness-110 transition-all shadow-lg shadow-orange-100 uppercase tracking-[0.2em]">
                  {nav.ctaLabel}
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <SearchBar />
              {/* Mobile Menu */}
              <MobileMenu nav={nav} categories={categories} />
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-[#2d2d35] text-white py-32 px-6 mt-32 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f08554]/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>

          <div className="max-w-7xl mx-auto relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
               {/* Brand Column */}
               <div className="md:col-span-5">
                 <Link href="/" className="inline-block mb-8">
                    <span className="text-3xl font-black italic-header italic tracking-tighter uppercase block">
                        {config?.siteName || "FutureFlow"} <span className="text-[#f08554]">AI</span>
                    </span>
                 </Link>
                 <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-medium mb-10">
                   {config?.footerTagline || config?.siteTagline || "The definitive source for AI strategy, automation, and future-proof digital workflows."}
                 </p>
               </div>

               {/* Categories Column */}
               <div className="md:col-span-3 md:col-start-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">Topic Library</h4>
                  <ul className="space-y-4">
                    {categories.map((cat, idx) => (
                      <li key={idx}>
                        <Link href={`/category/${cat.slug.current}`} className="text-xs font-bold text-slate-300 hover:text-[#f08554] transition-colors uppercase tracking-widest">
                            {cat.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
               </div>

               {/* Navigation Column */}
               <div className="md:col-span-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">Organization</h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="https://seo.futureflowai.in/" target="_blank" className="text-xs font-bold text-[#f08554] hover:brightness-110 transition-colors uppercase tracking-widest flex items-center gap-2">
                          SEO Audit Tool <span className="text-[10px]">↗</span>
                      </Link>
                    </li>
                    {config?.footerLinks?.map((link, idx) => (
                      <li key={idx}>
                        <Link href={link.url || "#"} className="text-xs font-bold text-slate-300 hover:text-[#f08554] transition-colors uppercase tracking-widest">
                            {link.label}
                        </Link>
                      </li>
                    )) || (
                        <>
                            <li><Link href="/about" className="text-xs font-bold text-slate-300 hover:text-[#f08554] transition-colors uppercase tracking-widest">About Us</Link></li>
                            <li><Link href="/contact" className="text-xs font-bold text-slate-300 hover:text-[#f08554] transition-colors uppercase tracking-widest">Contact</Link></li>
                        </>
                    )}
                  </ul>
               </div>
             </div>

             {/* Bottom Bar */}
             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                 {config?.footerCopyright || `© ${new Date().getFullYear()} FUTUREFLOW AI — ALL RIGHTS RESERVED`}
               </p>
               <div className="flex gap-10">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Built for the AI Era</span>
               </div>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}