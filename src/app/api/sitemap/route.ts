
export async function GET() {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://spokosopot.pl/</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://spokosopot.pl/offer</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spokosopot.pl/menu</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://spokosopot.pl/about</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://spokosopot.pl/gallery</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://spokosopot.pl/contact</loc>
    <lastmod>2024-12-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
		},
	})
}