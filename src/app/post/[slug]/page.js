import { urlFor } from "../../../sanity/imageBuilder"; 
import { client } from "../../../sanity/client";       
import { PortableText } from "@portabletext/react";
import Link from "next/link";

const myPortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-8">
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt || "FutureFlow AI"}
          className="rounded-lg shadow-md mx-auto"
        />
      </div>
    ),
    // Fixed: table is now correctly inside types
    table: ({ value }) => {
      if (!value?.rows) return null;
      return (
        <div className="overflow-x-auto my-10 shadow-sm border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 bg-white">
            <tbody className="divide-y divide-slate-200">
              {value.rows.map((row, i) => (
                <tr key={row._key || i} className={i === 0 ? "bg-slate-50 font-bold" : ""}>
                  {row.cells?.map((cell, j) => (
                    <td key={j} className="px-6 py-4 text-sm text-slate-700 border-r border-slate-100 last:border-r-0">
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
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-8 mb-3">{children}</h3>,
    normal: ({ children }) => <p className="text-lg leading-relaxed mb-4 text-slate-700">{children}</p>,
  },
};

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }) {
  // Await the params for Next.js 16+
  const { slug } = await params; 

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      mainImage,
      publishedAt
    }`,
    { slug: slug }
  );

  if (!post) {
    return <div className="p-20 text-center">Article not found.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 py-12">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block font-medium">
        ← Back to Home
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-slate-900">{post.title}</h1>
      
      <p className="text-gray-500 mb-8 pb-8 border-b">
        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
        })}
      </p>

      {post.mainImage && (
        <img 
          src={urlFor(post.mainImage).width(1200).url()} 
          className="w-full h-auto rounded-xl mb-12 shadow-lg"
          alt={post.title}
        />
      )}

      <div className="prose prose-lg max-w-none">
        <PortableText value={post.body} components={myPortableTextComponents} />
      </div>
    </main>
  );
}