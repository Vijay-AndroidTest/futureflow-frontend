import "./globals.css";
import Link from "next/link";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/imageBuilder";

export async function generateMetadata() {
  const config = await client.fetch(`*[_type == "siteSettings"][0]{ defaultSeoTitle, defaultSeoDescription, favicon }`);
  return {
    title: config?.defaultSeoTitle || "FutureFlow AI",
    description: config?.defaultSeoDescription,
    icons: {
      icon: config?.favicon ? urlFor(config.favicon).url() : "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }) {
  // Fetch Singletons with revalidation to avoid empty states
  const nav = await client.fetch(`*[_type == "navigationSettings"][0]`, {}, { next: { revalidate: 60 } });
  const config = await client.fetch(`*[_type == "siteSettings"][0]`, {}, { next: { revalidate: 60 } });

  return (
    <html lang="en">
      <head>
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

        {/* Top Link Nav */}
        <div className="bg-white border-b border-slate-100 py-2 hidden md:block">
           <div className="max-w-7xl mx-auto px-6 flex justify-start gap-8">
             {nav?.topNavItems ? nav.topNavItems.map((item, idx) => (
               <Link key={idx} href={item.link || "#"} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">
                 {item.label}
               </Link>
             )) : (
               <>
                 <Link href="/" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">Homepage</Link>
                 <Link href="/post" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">Article</Link>
               </>
             )}
           </div>
        </div>

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
          </div>
        </nav>

        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-[#2d2d35] text-white py-24 px-6 mt-32">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
               <div className="col-span-1 md:col-span-2">
                 <span className="text-2xl font-black italic-header italic tracking-tighter uppercase mb-6 block">
                    {config?.siteName || "FutureFlow"} <span className="text-[#f08554]">AI</span>
                 </span>
                 <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-medium">
                   {config?.footerTagline || config?.siteTagline || "Your daily source for AI mastery."}
                 </p>
               </div>
               <div className="col-span-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Navigation</h4>
                  <ul className="space-y-4 text-xs font-bold text-slate-300">
                    {config?.footerLinks?.map((link, idx) => (
                      <li key={idx} className="hover:text-[#f08554] transition-colors">
                        <Link href={link.url || "#"}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
               </div>
             </div>
             <div className="pt-12 border-t border-white/5">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 {config?.footerCopyright || `© ${new Date().getFullYear()} FUTUREFLOW AI — ALL RIGHTS RESERVED`}
               </p>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}