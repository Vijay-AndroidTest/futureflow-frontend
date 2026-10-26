import { urlFor } from "../../sanity/imageBuilder";
import { client } from "../../sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalloutBox, CustomTable, StatCallout, PromptBox, AffiliateCard } from "../../components/EditorialBlocks";

const myPortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value).width(1400).fit('max').auto('format').url();
      return (
        <figure className="my-8 w-full flex flex-col items-center bg-transparent p-0 border-0 shadow-none">
          <img
            src={imageUrl}
            alt={value.alt || 'Page Image'}
            className="w-full h-auto max-w-full object-contain rounded-xl shadow-sm"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    calloutBox: ({ value }) => (
      <CalloutBox type={value.type} title={value.title} text={value.text} />
    ),
    customTable: ({ value }) => (
      <CustomTable title={value.title} headers={value.headers} rows={value.rows} />
    ),
    statCallout: ({ value }) => (
      <StatCallout stat={value.stat} label={value.label} description={value.description} />
    ),
    promptBox: ({ value }) => (
      <PromptBox prompt={value.prompt} title={value.title} />
    ),
    affiliateCard: ({ value }) => (
      <AffiliateCard
        name={value.name}
        rating={value.rating}
        pros={value.pros}
        link={value.link}
        description={value.description}
        image={value.image ? urlFor(value.image).width(400).url() : null}
      />
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="text-2xl lg:text-3xl font-black mt-12 mb-6 tracking-tight brand-header border-l-4 border-[#0878F9] pl-6 text-[#0B1739]">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl lg:text-2xl font-black mt-10 mb-4 tracking-tight brand-header text-[#0B1739]">{children}</h3>,
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-8 text-slate-600 font-medium">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-5 my-8 space-y-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-5 my-8 space-y-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-lg text-slate-600 font-medium leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-lg text-slate-600 font-medium leading-relaxed">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          target={!value.href.startsWith("/") ? "_blank" : undefined}
          className="text-[#0878F9] underline font-bold hover:text-[#0B1739] transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

export async function generateStaticParams() {
  const pages = await client.fetch(`*[_type == "page" && defined(slug.current)]{ "slug": slug.current }`);
  return (pages || []).filter(p => p?.slug).map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug && defined(slug.current)][0]{
      title,
      description
    }`,
    { slug }
  );

  const siteConfig = await client.fetch(`*[_type == "siteSettings"][0]{ siteName }`);
  const baseUrl = "https://futureflowai.in";

  return {
    title: page?.title ? `${page.title} | ${siteConfig?.siteName || "FutureFlow AI"}` : siteConfig?.siteName,
    description: page?.description,
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
  };
}

export default async function GenericPage({ params }) {
  const { slug } = await params;

  const page = await client.fetch(
    `*[_type == "page" && slug.current == $slug && defined(slug.current)][0]{
      title,
      body,
      mainImage,
      description
    }`,
    { slug: slug }
  );

  if (!page || !page.title) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-24 pb-8 md:pb-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 md:mb-10 leading-[1.05] text-[#0B1739] brand-header tracking-tight">
            {page.title}
        </h1>

        {page.description && (
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed mb-10 md:mb-16">
                {page.description}
            </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24">
        {page.mainImage && (
            <div className="aspect-video w-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-50">
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
