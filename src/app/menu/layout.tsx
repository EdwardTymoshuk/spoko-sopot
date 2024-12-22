export const metadata = {
	title: 'Menu | Restauracja Spoko',
	description:
		'Odkryj wyjątkowe menu Restauracji Spoko w Sopocie. Śniadania, przystawki, desery i dania główne, tworzone z najlepszych sezonowych składników. Smacznego!',
	keywords: [
		'menu restauracji',
		'Restauracja Spoko',
		'potrawy',
		'dania sezonowe',
		'Sopotu',
		'śniadania',
		'desery',
		'dania główne',
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
