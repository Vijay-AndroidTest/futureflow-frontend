import { client } from "../../../sanity/client";
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`);
  return (posts || []).filter(p => p?.slug).map((post) => ({
    slug: post.slug,
  }));
}

export default async function LegacyBlogRedirect({ params }) {
  const { slug } = await params;
  if (slug) {
    redirect(`/post/${slug}`);
  }
  redirect('/post');
}
