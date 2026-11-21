'use client';

import { useState } from 'react';

export default function QuickAuditBar() {
  const [url, setUrl] = useState('');

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      window.open('https://seo.futureflowai.in/', '_blank');
      return;
    }

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const auditUrl = `https://seo.futureflowai.in/?url=${encodeURIComponent(cleanUrl)}`;
    window.open(auditUrl, '_blank');
  };

  return (
    <div className="w-full max-w-xl mb-8 sm:mb-10">
      <form
        onSubmit={handleAudit}
        className="flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/5 border border-white/15 p-2 rounded-2xl shadow-xl backdrop-blur-sm focus-within:border-[#00C7E8]/70 transition-all"
      >
        <div className="flex items-center flex-grow px-3 py-2 text-white">
          <span className="text-slate-400 text-sm mr-2 select-none">🌐</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL (e.g. mysite.com)"
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-[#0878F9] hover:bg-[#0660c8] text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Run Free Audit</span>
          <span>↗</span>
        </button>
      </form>

      {/* Quick utility pill tags */}
      <div className="flex flex-wrap items-center gap-2 mt-3.5 text-[11px] text-slate-300">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Free Tools:</span>
        <a
          href="https://seo.futureflowai.in/robots-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          Robots.txt Validator
        </a>
        <a
          href="https://seo.futureflowai.in/schema-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          Schema Generator
        </a>
        <a
          href="https://seo.futureflowai.in/page-speed-checker"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          Core Web Vitals
        </a>
      </div>
    </div>
  );
}
