import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  return [];
}

export default async function LegacyCategoryRedirect({ params }) {
  const { slug } = await params;
  if (slug) {
    redirect(`/category/${slug}`);
  }
  redirect('/category');
}
