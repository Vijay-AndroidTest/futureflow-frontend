'use client';

import { useState } from 'react';

export default function GrowthNewsletterCard() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <div className="my-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1739] via-[#0E1E4C] to-[#0B1739] p-8 sm:p-12 text-white border border-white/10 shadow-2xl relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C7E8]/10 rounded-full blur-[90px] -mr-32 -mt-32 pointer-events-none"></div>

      <div className="relative z-10 max-w-xl">
        <span className="text-[#00C7E8] text-[10px] font-black uppercase tracking-[0.35em] block mb-3">
          Weekly Growth Intelligence
        </span>
        <h3 className="text-2xl sm:text-3xl font-black brand-header tracking-tight text-white mb-3">
          Don't Miss the Next Algorithm Shift.
        </h3>
        <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed mb-6">
          Practical breakdowns of Google core updates, GEO (Generative Engine Optimization) tests, and real-world experiments. No fluff, just actionable data.
        </p>

        {submitted ? (
          <div className="rounded-xl bg-white/10 border border-emerald-400/40 p-4 text-emerald-300 text-sm font-bold flex items-center gap-3">
            <span>✓</span>
            <span>You're subscribed! Keep an eye on your inbox for our next growth dispatch.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#00C7E8] focus:bg-white/15 transition-all flex-grow"
            />
            <button
              type="submit"
              className="bg-[#0878F9] hover:bg-[#0660c8] text-white px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shrink-0 shadow-lg shadow-blue-500/30"
            >
              Get Free Intel →
            </button>
          </form>
        )}

        <div className="flex items-center gap-4 mt-6 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Zero spam. Unsubscribe anytime.
          </span>
          <span>•</span>
          <span>Read by 4,500+ SEOs & Founders</span>
        </div>
      </div>
    </div>
  );
}
