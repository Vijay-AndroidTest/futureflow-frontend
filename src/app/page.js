import { client } from "@/app/sanity/client";
import Link from "next/link"; // <-- We added the official Next.js Link tool

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...10]{_id, title, slug, publishedAt}`;

export default async function Home() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto font-sans">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">FutureFlow AI Blog</h1>

      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post._id} className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white text-black">
            
            {/* We wrapped your text in a Link that points to the article's unique slug! */}
            <Link href={`/post/${post.slug.current}`} className="block">
              <h2 className="text-2xl font-semibold hover:text-blue-600 hover:underline transition-all">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Published on: {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently'}
              </p>
            </Link>

          </li>
        ))}
      </ul>
    </main>
  );
}