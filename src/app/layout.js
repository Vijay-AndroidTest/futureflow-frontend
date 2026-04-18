import "./globals.css";
import Link from "next/link";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/imageBuilder";

export const revalidate = 0;

export default async function RootLayout({ children }) {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]`);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {settings?.logo ? (
                <img src={urlFor(settings.logo).height(40).url()} alt="Logo" className="h-8 w-auto" />
              ) : (
                <span className="text-xl font-black tracking-tighter uppercase italic">
                  FUTUREFLOW <span className="text-blue-600">AI</span>
                </span>
              )}
            </Link>

            {/* Nav Menu */}
            <div className="flex gap-6">
              {settings?.mainMenu?.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.link || "#"} 
                  className={item.isButton 
                    ? "bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 transition-all" 
                    : "text-slate-500 hover:text-blue-600 text-xs font-bold uppercase tracking-wider transition-all"
                  }
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-20">
          <div className="max-w-7xl mx-auto text-center md:text-left">
             <span className="text-white font-black text-xl tracking-tighter uppercase mb-4 block">FUTUREFLOW AI</span>
             <p className="text-xs tracking-widest uppercase font-bold">{settings?.footerCopyright || "© 2026 FutureFlow AI"}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}