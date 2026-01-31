export const metadata = {
	title: 'Galeria zdjęć | Restauracja Spoko',
	description:
		'Odkryj galerię zdjęć Restauracji Spoko w Sopocie. Zobacz nasze potrawy, wnętrza oraz niezapomniane chwile tworzone z pasją dla naszych gości.',
	keywords: [
		'galeria zdjęć',
		'Restauracja Spoko',
		'Sopot',
		'zdjęcia restauracji',
		'klimat restauracji',
		'Bałtyk',
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
