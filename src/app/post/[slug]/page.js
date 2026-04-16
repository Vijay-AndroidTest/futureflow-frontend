import { urlFor } from "@/app/sanity/imageBuilder";
import { client } from "@/app/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

const POST_QUERY = `*[
  _type == "post" 
  && slug.current == $slug
][0]{
  title,
  publishedAt,
  body
}`;

// We merge EVERYTHING into one single dictionary
const myPortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-10 mb-4 text-blue-600">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold mt-8 mb-4 text-gray-900">{children}</h2>,
    normal: ({ children }) => <p className="text-gray-700 text-lg leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6 bg-gray-50 py-2">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" className="text-blue-600 hover:text-blue-800 hover:underline">
        {children}
      </a>
    ),
  },
  types: {
    // 1. THE TABLE BLUEPRINT
    table: ({ value }) => {
      if (!value || !value.rows || value.rows.length === 0) return null;
      const [head, ...rows] = value.rows;

      return (
        <div className="overflow-x-auto my-8 w-full">
          <table className="min-w-full text-left border-collapse border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                {head.cells.map((cell, i) => (
                  <th key={i} className="border border-gray-300 px-4 py-3 font-semibold text-gray-800">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-3 text-gray-700">
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
    
    // 2. THE IMAGE BLUEPRINT
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8 w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={urlFor(value).url()}
            alt={value.alt || 'Blog Image'}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      );
    },
  },
};

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    return <div className="p-8 text-center text-2xl font-bold mt-20">Article not found!</div>;
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto font-sans">
      <Link href="/" className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors mb-8 inline-block">
        &larr; Back to Home
      </Link>

      <article className="bg-white p-8 rounded-2xl shadow-sm border mt-4 text-black">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-8 border-b pb-4">
          Published on: {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently'}
        </p>

        <div>
          {post.body ? (
            <PortableText value={post.body} components={myPortableTextComponents} />
          ) : (
            <p>No content yet.</p>
          )}
        </div>
      </article>
    </main>
  );
}