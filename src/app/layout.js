import "./globals.css";
import Link from "next/link";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/imageBuilder";

export default async function RootLayout({ children }) {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]`);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="w-full glass-effect sticky top-0 z-50 border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              {settings?.logo ? (
                <img src={urlFor(settings.logo).height(40).url()} alt="Logo" className="h-7 md:h-9 w-auto" />
              ) : (
                <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-slate-900">
                  FUTUREFLOW<span className="text-blue-600 group-hover:text-blue-500 transition-colors">AI</span>
                </span>
              )}
            </Link>

            {/* Nav Menu */}
            <div className="hidden md:flex items-center gap-8">
              {settings?.mainMenu?.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.link || "#"} 
                  className={item.isButton 
                    ? "bg-slate-900 text-white px-6 py-2.5 rounded-full text-[11px] font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 hover:shadow-blue-200"
                    : "text-slate-500 hover:text-slate-900 text-[11px] font-bold uppercase tracking-widest transition-all"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Icon (Placeholder) */}
            <div className="md:hidden text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            </div>
          </div>
        </nav>

        <main className="pt-8">{children}</main>

        <footer className="bg-slate-900 text-slate-400 py-20 px-6 mt-32">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
               <div className="max-w-xs">
                 <span className="text-white font-black text-2xl tracking-tighter uppercase mb-6 block">FUTUREFLOW AI</span>
                 <p className="text-sm leading-relaxed text-slate-500">
                   The world's most comprehensive database of AI tools, compared and ranked for the modern professional.
                 </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                 <div>
                   <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">Directory</h4>
                   <ul className="space-y-4 text-xs font-bold">
                     <li className="hover:text-white transition-colors cursor-pointer">Top Rated</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Recently Added</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Categories</li>
                   </ul>
                 </div>
                 <div>
                   <h4 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">Company</h4>
                   <ul className="space-y-4 text-xs font-bold">
                     <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Submit Tool</li>
                     <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
                   </ul>
                 </div>
               </div>
             </div>

             <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
               <p className="text-[10px] tracking-[0.1em] uppercase font-bold text-slate-600">
                 {settings?.footerCopyright || `© ${new Date().getFullYear()} FutureFlow AI. All Rights Reserved.`}
               </p>
               <div className="flex gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                 {/* Social links placeholder */}
               </div>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}