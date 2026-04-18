"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import { urlFor } from "../sanity/imageBuilder";
import "swiper/css";
import "swiper/css/pagination";

export default function FeaturedSlider({ featuredPosts }: { featuredPosts: any[] }) {
  return (
    <div className="mb-20">
      <Swiper
        spaceBetween={0}
        autoplay={{ delay: 5000 }}
        loop={true}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm"
      >
        {featuredPosts.map((post) => (
          <SwiperSlide key={post._id}>
            <Link href={`/post/${post.slug?.current}`} className="group flex flex-col md:flex-row bg-white">
              <div className="md:w-3/5 aspect-video overflow-hidden">
                <img src={urlFor(post.mainImage).width(1000).url()} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="" />
              </div>
              <div className="md:w-2/5 p-12 flex flex-col justify-center">
                <span className="inline-block w-fit px-3 py-1 bg-blue-50 text-[#2563eb] font-black text-[10px] uppercase tracking-[0.2em] rounded-md mb-6">Featured Highlight</span>
                <h2 className="text-3xl font-extrabold leading-tight mb-8 group-hover:text-[#2563eb] transition-colors">{post.title}</h2>
                <div className="text-[11px] font-black text-slate-400 group-hover:text-[#2563eb] transition-all">READ FULL REVIEW →</div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}