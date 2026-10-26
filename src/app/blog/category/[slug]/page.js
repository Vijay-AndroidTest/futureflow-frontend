import { client } from "../../../../sanity/client";
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await client.fetch(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`);
  return (categories || []).filter(c => c?.slug).map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function LegacyCategoryRedirect({ params }) {
  const { slug } = await params;
  if (slug) {
    redirect(`/category/${slug}`);
  }
  redirect('/category');
}
