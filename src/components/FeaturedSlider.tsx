"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function FeaturedSlider({ featuredPosts }: { featuredPosts: any[] }) {
  if (!featuredPosts || featuredPosts.length === 0) return null;

  return (
    <div className="mb-20 group relative">
      <Swiper
        spaceBetween={0}
        effect={"fade"}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#f08554] !w-8 !rounded-full transition-all duration-300',
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white shadow-2xl shadow-slate-200/50"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post._id}>
            <Link href={`/post/${post.slug?.current}`} className="flex flex-col lg:flex-row min-h-[500px] lg:h-[600px]">
              {/* Image side - 60% width on desktop */}
              <div className="lg:w-3/5 relative overflow-hidden bg-slate-100">
                {post.mainImage && (
                  <img
                    src={urlFor(post.mainImage).width(1280).height(720).url()}
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                    alt={post.title}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute top-8 left-8">
                   <span className="px-4 py-1.5 bg-[#f08554] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-orange-500/20">
                     Featured Story
                   </span>
                </div>
              </div>

              {/* Content side - 40% width on desktop */}
              <div className="lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center bg-white border-l border-slate-50">
                <span className="text-[#f08554] text-[10px] font-black uppercase tracking-[0.3em] mb-6 block">
                  LATEST INSIGHTS
                </span>

                <h2 className="text-3xl lg:text-5xl font-black leading-[1.1] mb-8 text-slate-900 tracking-tighter italic">
                  {post.title}
                </h2>

                <p className="text-slate-500 text-lg leading-relaxed mb-10 line-clamp-3 font-medium">
                  {post.excerpt || "Explore the latest breakthroughs in AI technology and how they are reshaping the future of digital workflows and creative automation."}
                </p>

                <div className="flex items-center gap-4 group/btn">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
                    Read Full Story
                  </span>
                  <div className="w-12 h-px bg-slate-900 transition-all duration-300 group-hover/btn:w-20 group-hover/btn:bg-[#f08554]"></div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-50 flex gap-8">
                   <div>
                     <div className="text-xl font-black text-slate-900 italic tracking-tighter">
                        {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                     </div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PUBLISHED</div>
                   </div>
                   <div>
                     <div className="text-xl font-black text-slate-900 italic tracking-tighter">5 MIN</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">READ TIME</div>
                   </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom styles for swiper bullets if needed in globals.css, but Tailwind classes added above handle most of it */}
    </div>
  );
}