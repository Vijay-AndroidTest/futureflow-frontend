'use client';

import { useState } from 'react';

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="px-5 py-2.5 bg-[#0878F9] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#0660c8] transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span>Share</span>
          <span>↗</span>
        </button>
      )}

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 border border-slate-200 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1739] hover:border-[#0878F9] hover:text-[#0878F9] transition-colors"
      >
        Twitter / X
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-2.5 border border-slate-200 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1739] hover:border-[#0878F9] hover:text-[#0878F9] transition-colors"
      >
        LinkedIn
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className={`px-5 py-2.5 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
          copied
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-white text-[#0B1739] hover:border-[#0878F9] hover:text-[#0878F9]'
        }`}
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
