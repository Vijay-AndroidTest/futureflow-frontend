import { client } from "../sanity/client";

export const dynamic = "force-static";

export default async function sitemap() {
  const baseUrl = "https://futureflowai.in";

  // 1. Fetch Posts
  const posts = await client.fetch(`*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`);
  const postUrls = (posts || []).filter(post => post?.slug).map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post._updatedAt || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. Fetch Categories
  const categories = await client.fetch(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`);
  const categoryUrls = (categories || []).filter(cat => cat?.slug).map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(cat._updatedAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  // 3. Static Pages (Homepage)
  const routes = ["", "/post", "/category"].map((route) => ({
    url: route === "" ? `${baseUrl}/` : `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  const seoService = {
    url: "https://seo.futureflowai.in",
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  };

  return [...routes, seoService, ...postUrls, ...categoryUrls];
}
