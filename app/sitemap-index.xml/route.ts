const sitemaps = [
  "https://elfeel.me/sitemap.xml",
  "https://academy.elfeel.me/sitemap.xml",
  "https://systemforge.elfeel.me/sitemap.xml",
];

export function GET(): Response {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`),
    "</sitemapindex>",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
