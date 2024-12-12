export async function GET() {
	return new Response(
		`User-agent: *
  Disallow: /api/
  Disallow: /config/
  Disallow: /context/
  Disallow: /lib/
  Disallow: /types/
  Disallow: /components/
  Allow: /
  
  Sitemap: https://spokosopot.pl/api/sitemap`,
		{
			headers: {
				'Content-Type': 'text/plain',
			},
		}
	)
}
