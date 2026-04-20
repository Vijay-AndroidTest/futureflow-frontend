'use client';

import { useState } from 'react';

// 1. Prompt Box with One-Click Copy
export function PromptBox({ prompt, title = "Optimized Prompt" }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-10 bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
      <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-black text-[#f08554] uppercase tracking-[0.3em]">{title}</span>
        <button
            onClick={copy}
            className="text-[9px] font-black text-white uppercase tracking-widest hover:text-[#f08554] transition-colors"
        >
            {copied ? "✓ Copied" : "Copy Prompt"}
        </button>
      </div>
      <div className="p-8">
        <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{prompt}</p>
      </div>
    </div>
  );
}

// 2. High-Conversion Affiliate Card
export function AffiliateCard({ name, rating, pros, link, image, description }) {
  return (
    <div className="my-12 bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 md:p-12 shadow-xl hover:border-[#f08554] transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 bg-[#f08554] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
        Editor's Choice
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-center">
        {image && (
            <div className="w-32 h-32 flex-shrink-0 bg-slate-50 rounded-3xl border border-slate-100 p-4">
                <img src={image} alt={name} className="w-full h-full object-contain" />
            </div>
        )}
        <div className="flex-grow">
            <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-black italic-header italic uppercase tracking-tighter">{name}</h3>
                <div className="flex text-[#f08554] text-xs">
                    {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < rating ? "★" : "☆"}</span>
                    ))}
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-6">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {pros?.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        <span className="text-[#f08554]">✓</span> {pro}
                    </div>
                ))}
            </div>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#f08554] transition-all shadow-xl shadow-slate-200"
            >
                Get Started with {name} →
            </a>
        </div>
      </div>
    </div>
  );
}
