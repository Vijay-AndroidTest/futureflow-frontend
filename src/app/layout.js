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
  const nav = await client.fetch(`*[_type == "navigationSettings"][0]`);
  const config = await client.fetch(`*[_type == "siteSettings"][0]`);

  return (
    <html lang="en">
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
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">Homepage</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">Article</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900">Category</span>
           </div>
        </div>

        {/* Main Navigation */}
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 h-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
            {/* Dynamic Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              {config?.logo ? (
                <img
                  src={urlFor(config.logo).height(40).url()}
                  alt={config.logo.alt || "Logo"}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded">
                    <span className="text-white text-lg font-black tracking-tighter italic">F</span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">
                      {config?.siteName || "FutureFlow"} <span className="text-[#f08554]">AI</span>
                    </span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              {nav?.navItems ? nav.navItems.map((item, idx) => (
                <Link key={idx} href={item.link || "#"} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">
                  {item.label}
                </Link>
              )) : (
                ['AI Tools', 'Prompts', 'SEO', 'Guides', 'Trends', 'More Stories'].map((item) => (
                  <Link key={item} href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">
                    {item}
                  </Link>
                ))
              )}

              {nav?.ctaLabel && (
                <Link href={nav.ctaLink || "#"} className="bg-[#f08554] text-white px-6 py-2.5 rounded-lg text-[10px] font-black hover:brightness-110 transition-all shadow-lg shadow-orange-100 uppercase tracking-[0.2em]">
                  {nav.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Editorial Footer */}
        <footer className="bg-[#2d2d35] text-white py-24 px-6 mt-32">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
               <div className="col-span-1">
                 {config?.logo ? (
                    <img src={urlFor(config.logo).height(30).url()} alt={config.logo.alt || "Logo"} className="h-8 w-auto mb-6 brightness-0 invert" />
                 ) : (
                    <span className="text-2xl font-black italic tracking-tighter uppercase mb-6 block">
                      {config?.siteName || "FutureFlow"} <span className="text-[#f08554]">AI</span>
                    </span>
                 )}
                 <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium">
                   {config?.siteTagline || "Your daily source for AI mastery — tools, prompts, and growth strategies for the creators of tomorrow."}
                 </p>
               </div>

               {config?.footerColumns ? config.footerColumns.map((col, i) => (
                 <div key={i}>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">{col.title}</h4>
                   <ul className="space-y-4 text-xs font-bold text-slate-300">
                     {col.links?.map((link, j) => (
                        <li key={j} className="hover:text-[#f08554] cursor-pointer transition-colors">{link.label}</li>
                     ))}
                   </ul>
                 </div>
               )) : (
                ['AI Tools', 'Learn', 'Support'].map((title, i) => (
                  <div key={i}>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">{title}</h4>
                    <ul className="space-y-4 text-xs font-bold text-slate-300">
                      <li className="hover:text-[#f08554] cursor-pointer transition-colors">Image Generators</li>
                      <li className="hover:text-[#f08554] cursor-pointer transition-colors">Video Editors</li>
                      <li className="hover:text-[#f08554] cursor-pointer transition-colors">SEO Workflows</li>
                    </ul>
                  </div>
                ))
               )}
             </div>

             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 {config?.footerCopyright || `© ${new Date().getFullYear()} ${config?.siteName?.toUpperCase() || "FUTUREFLOW AI"} — ALL RIGHTS RESERVED`}
               </p>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}