'use client';

import { useState } from 'react';

// 1. Callout Box (Strategy / Key Takeaways Box)
export function CalloutBox({ type = 'takeaway', title, text }) {
  const getTheme = () => {
    switch (type) {
      case 'tip':
        return {
          border: 'border-emerald-500 bg-emerald-50/50 text-emerald-950',
          badge: 'bg-emerald-500 text-white',
          icon: '💡',
          label: title || 'Pro Tip'
        };
      case 'warning':
        return {
          border: 'border-amber-500 bg-amber-50/50 text-amber-950',
          badge: 'bg-amber-500 text-white',
          icon: '⚠️',
          label: title || 'Important Warning'
        };
      case 'insight':
        return {
          border: 'border-[#00C7E8] bg-[#0B1739] text-white',
          badge: 'bg-[#00C7E8] text-[#0B1739]',
          icon: '✨',
          label: title || 'Key Insight'
        };
      case 'takeaway':
      default:
        return {
          border: 'border-[#0878F9] bg-blue-50/50 text-[#0B1739]',
          badge: 'bg-[#0878F9] text-white',
          icon: '📌',
          label: title || 'Key Takeaway'
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`my-8 p-6 sm:p-8 rounded-2xl md:rounded-3xl border-l-4 shadow-lg ${theme.border}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{theme.icon}</span>
        <span className={`text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full ${theme.badge}`}>
          {theme.label}
        </span>
      </div>
      {text && <p className="text-base sm:text-lg font-medium leading-relaxed mt-2">{text}</p>}
    </div>
  );
}

// 2. Custom Comparison & Metrics Table
export function CustomTable({ title, headers = [], rows = [] }) {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="my-10 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 shadow-xl bg-white">
      {title && (
        <div className="bg-[#0B1739] px-6 py-4 border-b border-white/10">
          <h4 className="text-sm font-black uppercase tracking-widest text-[#00C7E8] brand-header">{title}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          {headers && headers.length > 0 && (
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-[#0B1739]">
              <tr>
                {headers.map((head, idx) => (
                  <th key={idx} className="px-6 py-4 border-r border-slate-100 last:border-r-0">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-100 text-sm font-medium">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                {row.label && (
                  <td className="px-6 py-4 font-bold text-[#0B1739] border-r border-slate-100">
                    {row.label}
                  </td>
                )}
                {row.cells?.map((cell, cIdx) => (
                  <td key={cIdx} className="px-6 py-4 border-r border-slate-100 last:border-r-0">
                    {typeof cell === 'object' ? (
                      cell.highlight ? (
                        <span className="inline-block bg-blue-100 text-[#0878F9] px-3 py-1 rounded-full text-xs font-bold">
                          {cell.text}
                        </span>
                      ) : (
                        <span className={cell.isBold ? 'font-bold text-[#0B1739]' : 'text-slate-700'}>
                          {cell.text}
                        </span>
                      )
                    ) : (
                      <span className="text-slate-700">{cell}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 3. Key Stat Number Callout
export function StatCallout({ stat, label, description }) {
  return (
    <div className="my-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#F4F7FC] to-blue-50/50 border border-blue-100 shadow-xl flex flex-col items-center sm:items-start text-center sm:text-left">
      {stat && (
        <span className="text-5xl sm:text-6xl font-black brand-header text-[#0878F9] tracking-tight mb-2">
          {stat}
        </span>
      )}
      {label && (
        <h4 className="text-lg sm:text-xl font-bold brand-header text-[#0B1739] mb-2">
          {label}
        </h4>
      )}
      {description && (
        <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}

// 4. FAQ Accordion Grid with Google FAQPage Schema
export function FaqSection({ title = "Frequently Asked Questions", faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.question || item.q || "",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer || item.a || ""
      }
    }))
  };

  return (
    <div className="my-12 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-6 border-b border-slate-100 pb-4">
        <span className="text-[#0878F9] text-[10px] font-black uppercase tracking-[0.4em] block mb-1">Q&A</span>
        <h3 className="text-2xl sm:text-3xl font-black brand-header text-[#0B1739] tracking-tight">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          const question = item.question || item.q || "";
          const answer = item.answer || item.a || "";

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-[#0878F9] bg-blue-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-bold brand-header text-[#0B1739] leading-snug">
                  {question}
                </span>
                <span className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300 text-xs font-black text-[#0B1739] ${isOpen ? 'rotate-180 bg-[#0878F9] text-white' : ''}`}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100/60 text-slate-600 font-medium text-base leading-relaxed animate-in fade-in duration-200">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Legacy Prompt Box Backup
export function PromptBox({ prompt, title = "Optimized Prompt" }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-10 bg-[#0B1739] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
      <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-black text-[#00C7E8] uppercase tracking-[0.3em]">{title}</span>
        <button
            onClick={copy}
            className="text-[9px] font-black text-white uppercase tracking-widest hover:text-[#00C7E8] transition-colors"
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

// Legacy Affiliate Card Backup
export function AffiliateCard({ name, rating, pros, link, image, description }) {
  return (
    <div className="my-12 bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 md:p-12 shadow-xl hover:border-[#0878F9] transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 bg-[#0878F9] text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
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
                <h3 className="text-2xl font-black brand-header text-[#0B1739]">{name}</h3>
                <div className="flex text-[#0878F9] text-xs">
                    {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < rating ? "★" : "☆"}</span>
                    ))}
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-6">{description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {pros?.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        <span className="text-[#0878F9]">✓</span> {pro}
                    </div>
                ))}
            </div>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0878F9] text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0660c8] transition-all shadow-xl shadow-blue-500/20"
            >
                Get Started with {name} →
            </a>
        </div>
      </div>
    </div>
  );
}
