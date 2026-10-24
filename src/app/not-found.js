import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-white flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-[#0878F9] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          404 — Page Not Found
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black brand-header tracking-tight text-[#0B1739] mb-6">
          Lost in the Data?
        </h1>
        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 max-w-lg mx-auto">
          The article or page you are looking for may have been moved, renamed, or updated for our Digital Marketing & AI Search focus.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-[#0878F9] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#0660c8] transition-all shadow-xl shadow-blue-500/20 text-center"
          >
            ← Back to Homepage
          </Link>
          <Link
            href="/post"
            className="w-full sm:w-auto bg-[#0B1739] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#162758] transition-all shadow-xl shadow-slate-200 text-center"
          >
            Browse All Articles
          </Link>
        </div>
      </div>
    </main>
  );
}
