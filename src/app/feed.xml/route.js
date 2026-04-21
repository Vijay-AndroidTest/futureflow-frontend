import { client } from "../../sanity/client";

export const dynamic = "force-static";

export async function GET() {
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...20] {
    title,
    "slug": slug.current,
    description,
    publishedAt
  }`);

  const baseUrl = "https://futureflowai.in";

  const items = posts
    .map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/post/${post.slug}</link>
      <description>${escapeXml(post.description || "")}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid>${baseUrl}/post/${post.slug}</guid>
    </item>
  `)
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>FutureFlow AI</title>
      <link>${baseUrl}</link>
      <description>Master AI. Rank faster. Build more.</description>
      <language>en-us</language>
      ${items}
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
  });
}
