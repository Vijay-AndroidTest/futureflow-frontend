import "./globals.css";
import Link from "next/link";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/imageBuilder";

export default async function RootLayout({ children }) {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]`);

  return (
    <html lang="en">
      <body className="min-h-screen">
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
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded">
                <span className="text-white text-lg font-black tracking-tighter italic">F</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">
                  FutureFlow <span className="text-[#f08554]">AI</span>
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              {['AI Tools', 'Prompts', 'SEO', 'Guides', 'Trends', 'More Stories'].map((item) => (
                <Link key={item} href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Editorial Footer */}
        <footer className="bg-[#2d2d35] text-white py-24 px-6 mt-32">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
               <div className="col-span-1">
                 <span className="text-2xl font-black italic tracking-tighter uppercase mb-6 block">
                   FutureFlow <span className="text-[#f08554]">AI</span>
                 </span>
                 <p className="text-sm text-slate-400 leading-relaxed max-w-xs font-medium">
                   Your daily source for AI mastery — tools, prompts, and growth strategies for the creators of tomorrow.
                 </p>
               </div>

               {['AI Tools', 'Learn', 'Support'].map((title, i) => (
                 <div key={i}>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">{title}</h4>
                   <ul className="space-y-4 text-xs font-bold text-slate-300">
                     <li className="hover:text-[#f08554] cursor-pointer transition-colors">Image Generators</li>
                     <li className="hover:text-[#f08554] cursor-pointer transition-colors">Video Editors</li>
                     <li className="hover:text-[#f08554] cursor-pointer transition-colors">SEO Workflows</li>
                   </ul>
                 </div>
               ))}
             </div>

             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2026 FUTUREFLOW AI — ALL RIGHTS RESERVED</p>
             </div>
          </div>
        </footer>
      </body>
    </html>
  );
}