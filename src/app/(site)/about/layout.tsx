export const metadata = {
	title: 'O nas | Restauracja Spoko',
	description:
		'Restauracja Spoko w Sopocie – wyjątkowe smaki i niezapomniana atmosfera. Odkryj nasze menu inspirowane kuchnią europejską i lokalnymi składnikami!',
	keywords: [
		'Restauracja Spoko',
		'Sopot restauracja',
		'Restauracja w Sopocie',
		'Restauracja Sopot',
		'Restauracja nad morzem',
		'Restauracja z widokiem na morze',
		'o nas',
		'europejska kuchnia',
		'polskie smaki',
	],
	authors: [{ name: 'Restauracja Spoko' }],
	viewport: 'width=device-width, initial-scale=1.0',
	openGraph: {
		title: 'O nas | Restauracja Spoko',
		description:
			'Restauracja Spoko w Sopocie oferuje wyjątkowe smaki kuchni lokalnej i europejskiej. Odwiedź nas i poczuj niepowtarzalną atmosferę!',
		images: '/img/about-page.jpg',
		type: 'website',
	},
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>
}
