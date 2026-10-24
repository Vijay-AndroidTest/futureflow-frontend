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
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#0878F9] !w-8 !rounded-full transition-all duration-300',
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white shadow-2xl shadow-slate-200/50"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post._id}>
            <Link href={`/post/${post.slug?.current}`} className="flex flex-col lg:grid lg:grid-cols-12 min-h-0 lg:min-h-[500px]">

              {/* Image Side - Locked to 16:9 Aspect Ratio */}
              <div className="lg:col-span-7 relative overflow-hidden bg-slate-100 aspect-video lg:aspect-auto">
                {post.mainImage && (
                  <img
                    src={urlFor(post.mainImage).width(1280).height(720).url()}
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                    alt={post.mainImage.alt || post.title}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                   <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#0878F9] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg">
                     EDITOR'S CHOICE
                   </span>
                </div>
              </div>

              {/* Content Side - Matches Image Height */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
                <span className="text-[#0878F9] text-[9px] font-black uppercase tracking-[0.3em] mb-3 sm:mb-4 block">
                  INSIGHT REPORT
                </span>

                <h2 className="text-xl sm:text-2xl lg:text-4xl font-black leading-snug mb-4 sm:mb-6 text-[#0B1739] brand-header tracking-tight">
                  {post.title}
                </h2>

                <p className="text-slate-500 text-sm lg:text-base leading-relaxed mb-6 sm:mb-8 line-clamp-3 font-medium">
                  {post.description || "Deep dive into proven digital marketing strategies, SEO insights, and growth workflows."}
                </p>

                <div className="flex items-center gap-4 group/btn mt-auto lg:mt-0">
                  <span className="text-[10px] font-black text-[#0B1739] uppercase tracking-[0.2em]">
                    Read Full Story
                  </span>
                  <div className="w-12 h-px bg-[#0B1739] transition-all duration-300 group-hover/btn:w-20 group-hover/btn:bg-[#0878F9]"></div>
                </div>

                <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-50 flex gap-6 sm:gap-8">
                   <div>
                     <div className="text-base sm:text-lg font-black text-[#0B1739] brand-header">
                        {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                     </div>
                     <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">PUBLISHED</div>
                   </div>
                   <div>
                     <div className="text-base sm:text-lg font-black text-[#0B1739] brand-header">
                        {post.readTime || 5} MIN
                     </div>
                     <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">READ TIME</div>
                   </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
