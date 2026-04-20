import { client } from '../sanity/client';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function sitemap() {
  const baseUrl = 'https://futureflow.ai';
  const data = await client.fetch(\{
    'posts': *[_type == 'post'] { 'slug': slug.current, _updatedAt },
    'categories': *[_type == 'category'] { 'slug': slug.current, _updatedAt },
    'pages': *[_type == 'page'] { 'slug': slug.current, _updatedAt }
  }\);

  const postEntries = data.posts.map((post) => ({
    url: \\/post/\\,
    lastModified: post._updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryEntries = data.categories.map((cat) => ({
    url: \\/category/\\,
    lastModified: cat._updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const pageEntries = data.pages.map((page) => ({
    url: \\/\\,
    lastModified: page._updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...postEntries,
    ...categoryEntries,
    ...pageEntries,
  ];
}