import { client } from "../sanity/client";

export default async function sitemap() {
  const baseUrl = "https://futureflow.ai";

  // Fetch data from Sanity
  const data = await client.fetch(`{
    "posts": *[_type == "post"] { "slug": slug.current, _updatedAt },
    "categories": *[_type == "category"] { "slug": slug.current, _updatedAt },
    "pages": *[_type == "page"] { "slug": slug.current, _updatedAt }
  }`);

  const postEntries = data.posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post._updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries = data.categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: cat._updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const pageEntries = data.pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page._updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...postEntries,
    ...categoryEntries,
    ...pageEntries,
  ];
}
