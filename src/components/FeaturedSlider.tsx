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

  const renderCard = (post: any) => {
    const category = post.category || post.categories?.[0];
    const categoryTitle = category?.title || "Digital Marketing";
    const categorySlug = category?.slug?.current || "digital-marketing";

    return (
      <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-0 lg:min-h-[480px] group/card bg-white">
        {/* Image Side - Uncropped with dark container padding */}
        <div className="lg:col-span-7 relative overflow-hidden bg-[#0B1739] aspect-video lg:aspect-auto flex items-center justify-center p-2">
          {post.mainImage && (
            <img
              src={urlFor(post.mainImage).width(1400).fit('max').auto('format').url()}
              className="w-full h-full object-contain transition-transform duration-700 group-hover/card:scale-102"
              alt={post.mainImage.alt || post.mainImage.caption || post.title || 'Featured article cover image'}
              loading="eager"
            />
          )}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <span className="px-3 sm:px-4 py-1.5 bg-[#0878F9] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg">
              EDITOR'S PICK
            </span>
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="mb-3 sm:mb-4">
            <Link
              href={`/category/${categorySlug}`}
              className="text-[#0878F9] text-xs font-extrabold uppercase tracking-[0.25em] hover:underline inline-block"
            >
              {categoryTitle}
            </Link>
          </div>

          <Link href={`/post/${post.slug?.current}`}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-snug mb-4 sm:mb-6 text-[#0B1739] brand-header tracking-tight hover:text-[#0878F9] transition-colors">
              {post.title}
            </h2>
          </Link>

          <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-6 sm:mb-8 line-clamp-3 font-medium">
            {post.description || `Explore key SEO insights and digital marketing strategies on ${post.title}.`}
          </p>

          <div className="flex items-center gap-4 group/btn mt-auto lg:mt-0">
            <Link
              href={`/post/${post.slug?.current}`}
              className="text-xs font-black text-[#0B1739] uppercase tracking-[0.2em] group-hover/btn:text-[#0878F9] transition-colors flex items-center gap-2"
            >
              Read Full Story
              <span className="text-[#0878F9]">→</span>
            </Link>
          </div>

          {/* WCAG AA Compliant Stat Badges */}
          <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-100 flex gap-6 sm:gap-10">
             <div>
               <div className="text-sm sm:text-base font-black text-[#0B1739] brand-header">
                  {new Date(post.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
               </div>
               <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">PUBLISHED</div>
             </div>
             <div>
               <div className="text-sm sm:text-base font-black text-[#0B1739] brand-header">
                  {post.readTime || 5} MIN
               </div>
               <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">READ TIME</div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  if (featuredPosts.length === 1) {
    return (
      <div className="mb-16 md:mb-24 rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50">
        {renderCard(featuredPosts[0])}
      </div>
    );
  }

  return (
    <div className="mb-16 md:mb-24 relative">
      <Swiper
        spaceBetween={0}
        effect={"fade"}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={true}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-[#0878F9] !w-8 !rounded-full transition-all duration-300',
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 bg-white"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post._id}>
            {renderCard(post)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
