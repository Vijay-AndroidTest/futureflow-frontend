import { urlFor } from "../../sanity/imageBuilder";
import { client } from "../../sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { redirect } from "next/navigation";

const myPortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-12">
        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <img
            src={urlFor(value).width(1280).height(720).url()}
            alt={value.alt || "Page Image"}
            className="w-full h-full object-cover"
            />
        </div>
      </div>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="text-3xl lg:text-4xl font-black mt-16 mb-8 tracking-tighter italic-header italic uppercase border-l-4 border-[#f08554] pl-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-black mt-12 mb-6 tracking-tight italic-header italic uppercase">{children}</h3>,
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-8 text-slate-600 font-medium">{children}</p>,
  },
};

export async function generateStaticParams() {
  const pages = await client.fetch(`*[_type == "page"]{ "slug": slug.current }`);
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function GenericPage({ params }) {
  const { slug } = await params;

  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      body,
      mainImage,
      description
    }`,
    { slug: slug }
  );

  if (!page) {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] text-slate-900 italic-header italic uppercase tracking-tighter">
            {page.title}
        </h1>

        {page.description && (
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-16 italic-header italic">
                {page.description}
            </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-24">
        {page.mainImage && (
            <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-2xl border border-slate-50">
                <img
                src={urlFor(page.mainImage).width(1920).height(1080).url()}
                className="w-full h-full object-cover"
                alt={page.mainImage.alt || page.title}
                />
            </div>
        )}
      </div>

      <article className="max-w-3xl mx-auto px-6 pb-32">
        <div className="prose prose-lg max-w-none prose-slate">
          <PortableText value={page.body} components={myPortableTextComponents} />
        </div>
      </article>
    </main>
  );
}