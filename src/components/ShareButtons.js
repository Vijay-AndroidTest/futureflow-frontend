'use client';

export default function ShareButtons({ title, url }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-colors"
      >
        Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-colors"
      >
        LinkedIn
      </a>
      <button
        onClick={copyToClipboard}
        className="px-6 py-2 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-colors"
      >
        Copy Link
      </button>
    </div>
  );
}