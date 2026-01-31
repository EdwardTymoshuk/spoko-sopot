export const metadata = {
	title: 'Nasza Oferta | Restauracja Spoko',
	description:
		'Restauracja Spoko w Sopocie zaprasza na organizację wyjątkowych przyjęć nad Bałtykiem. Oferujemy różnorodne menu, usługi premium i idealne rozwiązania na każdą okazję.',
	keywords: [
		'organizacja przyjęć',
		'oferta kulinarna',
		'Restauracja Spoko',
		'przyjęcia nad Bałtykiem',
		'menu dla dzieci',
		'usługi premium',
	],
	authors: [{ name: 'Restauracja Spoko' }],
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
