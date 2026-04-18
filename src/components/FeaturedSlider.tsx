"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";
// Replace the old imports with these:
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedSlider({ featuredPosts }: { featuredPosts: any[] }) {
  return (
    <div className="mb-20">
      <Swiper
        spaceBetween={24}
        autoplay={{ delay: 6000 }}
        loop={true}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="rounded-[3rem] overflow-hidden border border-slate-200 card-shadow"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post._id}>
            <Link href={`/post/${post.slug?.current}`} className="group flex flex-col md:flex-row bg-white min-h-[500px]">
              <div className="md:w-3/5 overflow-hidden bg-slate-50 relative">
                <img
                  src={urlFor(post.mainImage).width(1200).url()}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[1.5s] ease-out"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              </div>
              <div className="md:w-2/5 p-8 md:p-16 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-3 mb-8">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-md shadow-lg shadow-blue-100">
                    Featured Tool
                  </span>
                  <span className="h-px w-8 bg-slate-100"></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Editor's Choice</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1] mb-8 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                  {post.title}
                </h2>

                <p className="text-slate-500 text-sm leading-relaxed mb-10 line-clamp-2 font-medium">
                  {/* You can add a short excerpt here if available in CMS */}
                  Deep dive into how this tool is revolutionizing AI-assisted workflows in 2026.
                </p>

                <div className="inline-flex items-center gap-4 text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-all uppercase tracking-[0.2em]">
                  Read Deep Dive
                  <span className="w-10 h-px bg-slate-900 group-hover:bg-blue-600 group-hover:w-14 transition-all"></span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}