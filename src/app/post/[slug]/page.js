import { urlFor } from "../../../sanity/imageBuilder"; 
import { client } from "../../../sanity/client";       
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ShareButtons from "../../../components/ShareButtons";
import { CalloutBox, CustomTable, StatCallout, FaqSection, PromptBox, AffiliateCard } from "../../../components/EditorialBlocks";
import RelatedPosts from "../../../components/RelatedPosts";

const myPortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value).width(1400).fit('max').auto('format').url();
      return (
        <figure className="my-8 w-full flex flex-col items-center bg-transparent p-0 border-0 shadow-none">
          <img
            src={imageUrl}
            alt={value.alt || 'Article Image'}
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
    faqSection: ({ value }) => (
      <FaqSection title={value.title} faqs={value.faqs} />
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
    authorCredits: ({ value }) => (
      <div className="my-16 p-8 sm:p-10 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
        {value.author?.image && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
            <img
              src={urlFor(value.author.image).width(200).height(200).url()}
              alt={value.author.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-grow text-center md:text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 block">Written By</span>
          <h3 className="text-xl sm:text-2xl font-black brand-header text-[#0B1739] mb-1">{value.author?.name}</h3>
          {(value.author?.jobTitle || value.author?.credentials) && (
            <p className="text-xs font-bold text-[#0878F9] uppercase tracking-wider mb-3">
              {[value.author?.jobTitle, value.author?.credentials].filter(Boolean).join(" • ")}
            </p>
          )}
          <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl mb-4">
            {value.authorBio || value.author?.bio || "Expert contributor at FutureFlow AI specializing in SEO and digital growth strategies."}
          </p>
          {(value.author?.linkedinUrl || value.author?.twitterUrl) && (
            <div className="flex items-center justify-center md:justify-start gap-4">
              {value.author?.linkedinUrl && (
                <a href={value.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-500 hover:text-[#0878F9] uppercase tracking-wider transition-colors">
                  LinkedIn ↗
                </a>
              )}
              {value.author?.twitterUrl && (
                <a href={value.author.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-500 hover:text-[#0878F9] uppercase tracking-wider transition-colors">
                  Twitter / X ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    ),
    table: ({ value }) => {
      if (!value?.rows) return null;
      return (
        <div className="overflow-x-auto my-12 shadow-2xl border border-slate-100 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-100 bg-white">
            <tbody className="divide-y divide-slate-100">
              {value.rows.map((row, i) => (
                <tr key={row._key || i} className={i === 0 ? "bg-slate-50/50 font-black uppercase tracking-widest text-[10px]" : ""}>
                  {row.cells?.map((cell, j) => (
                    <td key={j} className="px-8 py-5 text-sm text-slate-700 border-r border-slate-50 last:border-r-0 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="text-2xl lg:text-3xl font-black mt-12 mb-6 tracking-tight brand-header border-l-4 border-[#0878F9] pl-6 text-[#0B1739]">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl lg:text-2xl font-black mt-10 mb-4 tracking-tight brand-header text-[#0B1739]">{children}</h3>,
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-8 text-slate-600 font-medium">{children}</p>,
    blockquote: ({ children }) => (
        <blockquote className="bg-slate-50 rounded-2xl p-10 border-l-4 border-[#0B1739] my-12 italic-header italic text-2xl text-[#0B1739]">
            {children}
        </blockquote>
    ),
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
  const posts = await client.fetch(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`);
  return (posts || []).filter(p => p?.slug).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug && defined(slug.current)][0]{
      title,
      seoTitle,
      seoDescription,
      description,
      mainImage,
      publishedAt
    }`,
    { slug }
  );

  const siteConfig = await client.fetch(`*[_type == "siteSettings"][0]{ siteName, defaultSeoTitle, defaultSeoDescription }`);
  const baseUrl = "https://futureflowai.in";

  const metaTitle = post?.seoTitle || post?.title || siteConfig?.defaultSeoTitle || siteConfig?.siteName || "FutureFlow AI";
  const metaDescription = post?.seoDescription || post?.description || siteConfig?.defaultSeoDescription || "Practical SEO guides and digital marketing strategies.";
  const imageUrl = post?.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : null;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/post/${slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${baseUrl}/post/${slug}`,
      type: 'article',
      publishedTime: post?.publishedAt,
      images: imageUrl ? [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post?.title || "Article Image",
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug && defined(slug.current)][0]{
      title,
      body[]{
        ...,
        _type == "authorCredits" => {
          ...,
          author->{
            name,
            image,
            bio,
            jobTitle,
            credentials,
            linkedinUrl,
            twitterUrl
          }
        }
      },
      mainImage,
      publishedAt,
      readTime,
      description,
      seoTitle,
      seoDescription,
      author->{
        name,
        image,
        bio,
        jobTitle,
        credentials,
        linkedinUrl,
        twitterUrl
      },
      "categories": categories[defined(@)]->{ title, slug },
      "category": category->{ title, slug }
    }`,
    { slug: slug }
  );

  if (!post) {
    redirect('/');
  }

  const validCategories = (post.categories || []).filter(Boolean).filter(c => c?.title && c?.slug?.current);
  const category = validCategories[0] || (post.category?.title && post.category?.slug?.current ? post.category : null);
  const baseUrl = "https://futureflowai.in";
  const postUrl = `${baseUrl}/post/${slug}`;
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : null;

  const postAuthor = post.author?.name ? {
    "@type": "Person",
    "name": post.author.name,
    "jobTitle": post.author.jobTitle || "SEO & Digital Growth Specialist",
    "sameAs": [post.author.linkedinUrl, post.author.twitterUrl].filter(Boolean)
  } : {
    "@type": "Organization",
    "name": "FutureFlow AI",
    "url": baseUrl
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        "headline": post.title,
        "description": post.seoDescription || post.description || "",
        "image": imageUrl ? [imageUrl] : [],
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "author": postAuthor,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": postUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": "FutureFlow AI",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/favicon.ico`
          }
        },
        "articleSection": category?.title || "Digital Marketing"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          ...(category ? [{
            "@type": "ListItem",
            "position": 2,
            "name": category.title,
            "item": `${baseUrl}/category/${category.slug?.current}`
          }] : []),
          {
            "@type": "ListItem",
            "position": category ? 3 : 2,
            "name": post.title,
            "item": postUrl
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-24 pb-8 md:pb-16">
        {/* Visual Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-[#0B1739] transition-colors">Home</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/category/${category.slug?.current}`} className="hover:text-[#0878F9] transition-colors text-[#0878F9]">
                {category.title}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-600 line-clamp-1 max-w-[200px] md:max-w-[300px]">{post.title}</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-8 md:mb-10 leading-[1.05] text-[#0B1739] brand-header tracking-tight">
            {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 md:gap-8 py-6 md:py-8 border-y border-slate-100 mb-8 md:mb-12">
            {post.author?.name && (
              <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Author</span>
                  <span className="text-xs font-black text-[#0878F9] uppercase">{post.author.name}</span>
              </div>
            )}
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Published</span>
                <span className="text-xs font-black text-[#0B1739] uppercase">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reading time</span>
                <span className="text-xs font-black text-[#0B1739] uppercase">{post.readTime || 5} Minutes</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Topic</span>
                {category ? (
                  <Link href={`/category/${category.slug?.current}`} className="text-xs font-black text-[#0878F9] uppercase hover:underline">
                    {category.title}
                  </Link>
                ) : (
                  <span className="text-xs font-black text-[#0878F9] uppercase">Digital Marketing</span>
                )}
            </div>
        </div>

        {post.description && (
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed mb-10 md:mb-16">
                {post.description}
            </p>
        )}
      </div>

      {/* Hero Image - Locked to 16:9 */}
      <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24">
        {post.mainImage && (
            <div className="aspect-video w-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-50">
                <img
                src={urlFor(post.mainImage).width(1920).height(1080).url()}
                className="w-full h-full object-cover"
                alt={post.mainImage.alt || post.title}
                />
            </div>
        )}
      </div>

      {/* Content Area */}
      <article className="max-w-3xl mx-auto px-6 pb-32">
        <div className="prose prose-lg max-w-none prose-slate">
          <PortableText value={post.body} components={myPortableTextComponents} />
        </div>

        {/* Author E-E-A-T Profile Card */}
        {post.author && (
          <div className="mt-16 p-8 sm:p-10 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8">
            {post.author.image && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                <img
                  src={urlFor(post.author.image).width(200).height(200).url()}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-grow text-center md:text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 block">Written By</span>
              <h3 className="text-xl sm:text-2xl font-black brand-header text-[#0B1739] mb-1">{post.author.name}</h3>
              {(post.author.jobTitle || post.author.credentials) && (
                <p className="text-xs font-bold text-[#0878F9] uppercase tracking-wider mb-3">
                  {[post.author.jobTitle, post.author.credentials].filter(Boolean).join(" • ")}
                </p>
              )}
              {post.author.bio && (
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4 max-w-xl">
                  {post.author.bio}
                </p>
              )}
              {(post.author.linkedinUrl || post.author.twitterUrl) && (
                <div className="flex items-center justify-center md:justify-start gap-4">
                  {post.author.linkedinUrl && (
                    <a href={post.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-500 hover:text-[#0878F9] uppercase tracking-wider transition-colors">
                      LinkedIn ↗
                    </a>
                  )}
                  {post.author.twitterUrl && (
                    <a href={post.author.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-500 hover:text-[#0878F9] uppercase tracking-wider transition-colors">
                      Twitter / X ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        <div className="mt-24 pt-16 border-t border-slate-100">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0878F9] mb-12 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <RelatedPosts currentSlug={slug} />
            </div>
        </div>

        {/* Article Footer */}
        <div className="mt-32 pt-16 border-t border-slate-100 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Share This Story</h2>
            <ShareButtons title={post.title} url={`https://futureflowai.in/post/${slug}`} />
        </div>
      </article>
    </main>
  );
}
