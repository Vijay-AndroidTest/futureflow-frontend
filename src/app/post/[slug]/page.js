import { urlFor } from "../../../sanity/imageBuilder"; 
import { client } from "../../../sanity/client";       
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ShareButtons from "../../../components/ShareButtons";
import { PromptBox, AffiliateCard } from "../../../components/EditorialBlocks";

const myPortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-12">
        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <img
            src={urlFor(value).width(1280).height(720).url()}
            alt={value.alt || "Article Image"}
            className="w-full h-full object-cover"
            />
        </div>
        {value.caption && <p className="text-center text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">{value.caption}</p>}
      </div>
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
      <div className="my-16 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center gap-10">
        {value.author?.image && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
            <img
              src={urlFor(value.author.image).width(200).height(200).url()}
              alt={value.author.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 block">Written By</span>
          <h4 className="text-2xl font-black italic-header italic uppercase mb-4 text-slate-900">{value.author?.name}</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
            {value.authorBio || value.author?.bio || "Expert contributor at FutureFlow AI specializing in automation and digital transformation."}
          </p>
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
    h2: ({ children }) => <h2 className="text-3xl lg:text-4xl font-black mt-16 mb-8 tracking-tighter italic-header italic uppercase border-l-4 border-[#f08554] pl-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-black mt-12 mb-6 tracking-tight italic-header italic uppercase">{children}</h3>,
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-8 text-slate-600 font-medium">{children}</p>,
    blockquote: ({ children }) => (
        <blockquote className="bg-slate-50 rounded-2xl p-10 border-l-4 border-slate-900 my-12 italic-header italic text-2xl text-slate-800">
            {children}
        </blockquote>
    ),
  },
};

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      seoTitle,
      seoDescription,
      mainImage
    }`,
    { slug }
  );

  const siteConfig = await client.fetch(`*[_type == "siteSettings"][0]{ siteName, defaultSeoTitle, defaultSeoDescription }`);
  const baseUrl = "https://futureflowai.in";

  return {
    title: post?.seoTitle || post?.title || siteConfig?.defaultSeoTitle || siteConfig?.siteName,
    description: post?.seoDescription || siteConfig?.defaultSeoDescription,
    alternates: {
      canonical: `${baseUrl}/post/${slug}`,
    },
    openGraph: {
      title: post?.title,
      description: post?.seoDescription || siteConfig?.defaultSeoDescription,
      url: `${baseUrl}/post/${slug}`,
      type: 'article',
      publishedTime: post?.publishedAt,
      images: post?.mainImage ? [{
        url: urlFor(post.mainImage).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.title,
      description: post?.seoDescription || siteConfig?.defaultSeoDescription,
      images: post?.mainImage ? [urlFor(post.mainImage).width(1200).height(630).url()] : [],
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body[]{
        ...,
        _type == "authorCredits" => {
          ...,
          author->{
            name,
            image,
            bio
          }
        }
      },
      mainImage,
      publishedAt,
      readTime,
      description,
      seoTitle
    }`,
    { slug: slug }
  );

  if (!post) {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <Link href="/" className="text-[10px] font-black text-[#f08554] uppercase tracking-[0.3em] mb-12 inline-block hover:translate-x-[-4px] transition-transform">
          ← Back to archive
        </Link>

        <h1 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] text-slate-900 italic-header italic uppercase tracking-tighter">
            {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-8 py-8 border-y border-slate-50 mb-12">
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Published</span>
                <span className="text-xs font-black text-slate-900 uppercase">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reading time</span>
                <span className="text-xs font-black text-slate-900 uppercase">{post.readTime || 5} Minutes</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Topic</span>
                <span className="text-xs font-black text-[#f08554] uppercase">AI Strategy</span>
            </div>
        </div>

        {post.description && (
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed mb-16 italic-header italic">
                {post.description}
            </p>
        )}
      </div>

      {/* Hero Image - Locked to 16:9 */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        {post.mainImage && (
            <div className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-2xl border border-slate-50">
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

        {/* You May Also Like Section */}
        <div className="mt-24 pt-16 border-t border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f08554] mb-12 text-center">You may also like</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* We'll fetch 2 related posts here in the next step, for now showing a placeholder logic */}
                <RelatedPosts currentSlug={slug} />
            </div>
        </div>

        {/* Article Footer */}
        <div className="mt-32 pt-16 border-t border-slate-100 text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Share this story</h4>
            <ShareButtons title={post.title} url={`https://futureflowai.in/post/${slug}`} />
        </div>
      </article>
    </main>
  );
}