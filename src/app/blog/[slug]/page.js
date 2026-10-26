import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  return [];
}

export default async function LegacyBlogRedirect({ params }) {
  const { slug } = await params;
  if (slug) {
    redirect(`/post/${slug}`);
  }
  redirect('/post');
}
