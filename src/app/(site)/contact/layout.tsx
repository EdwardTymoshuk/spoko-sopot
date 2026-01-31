export const metadata = {
	title: 'Kontakt | Restauracja Spoko',
	description:
		'Skontaktuj się z Restauracją Spoko w Sopocie. Zadzwoń, napisz email lub odwiedź nas na ul. Hestii 3. Odkryj wyjątkowe smaki i niezapomnianą atmosferę!',
	keywords: [
		'kontakt',
		'Restauracja Spoko',
		'Sopot',
		'godziny otwarcia',
		'rezerwacja',
		'telefon',
		'email',
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
