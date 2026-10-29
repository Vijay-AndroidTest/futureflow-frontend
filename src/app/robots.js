export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search?*', '/post?search=*', '/*?search=*'],
      },
      {
        userAgent: ['PerplexityBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
        allow: '/',
      },
    ],
    sitemap: 'https://futureflowai.in/sitemap.xml',
  };
}
