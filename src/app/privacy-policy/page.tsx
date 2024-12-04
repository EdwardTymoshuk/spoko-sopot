// polityka-prywatnosci.tsx
import React from 'react'
import MainContainer from '../components/MainContainer'

const PrivacyPolicy: React.FC = () => {
	return (
		<MainContainer className="max-w-3xl mx-auto px-6 pb-8 pt-20">
			<h1 className="text-3xl font-bold mb-4">Polityka Prywatności</h1>
			<p>
				Szanujemy Twoją prywatność i dbamy o ochronę Twoich danych osobowych. Ta polityka prywatności
				opisuje, jakie dane zbieramy, jak je przetwarzamy i w jakim celu.
			</p>

			<section className="mt-8">
				<h2 className="text-2xl font-semibold">1. Dane osobowe</h2>
				<p>
					W ramach kontaktu przez formularz na naszej stronie zbieramy jedynie dane niezbędne do
					obsługi Twojego zapytania. Są to:
				</p>
				<ul className="list-disc list-inside">
					<li>Imię i nazwisko</li>
					<li>Adres e-mail</li>
					<li>Treść wiadomości</li>
				</ul>
			</section>

			<section className="mt-8">
				<h2 className="text-2xl font-semibold">2. Wykorzystanie danych</h2>
				<p>
					Twoje dane wykorzystujemy wyłącznie w celu odpowiedzi na Twoje zapytanie oraz do prowadzenia
					dalszej korespondencji, jeśli będzie to konieczne. Dane te nie są udostępniane innym podmiotom
					ani nie są wykorzystywane do celów marketingowych.
				</p>
			</section>

			<section className="mt-8">
				<h2 className="text-2xl font-semibold">3. Pliki cookies</h2>
				<p>
					Nasza strona używa plików cookies, aby poprawić funkcjonowanie witryny i zapewnić jej
					prawidłowe działanie. Cookies są przechowywane w Twojej przeglądarce i mogą być używane
					przez nas w celu analizowania ruchu na stronie. Masz możliwość wyrażenia zgody lub odrzucenia
					plików cookies.
				</p>
			</section>

			<section className="mt-8">
				<h2 className="text-2xl font-semibold">4. Twoje prawa</h2>
				<p>
					Masz prawo do dostępu do swoich danych, ich poprawienia oraz usunięcia. W przypadku pytań
					lub wniosków dotyczących Twoich danych osobowych, prosimy o kontakt na adres e-mail:
					<a href="mailto:info@spokosopot.pl" className="text-primary hover:underline"> info@spokosopot.pl</a>.
				</p>
			</section>

			<section className="mt-8">
				<h2 className="text-2xl font-semibold">5. Zmiany w polityce prywatności</h2>
				<p>
					Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce prywatności. Każda
					zmiana zostanie opublikowana na tej stronie. Zachęcamy do regularnego sprawdzania naszej
					polityki prywatności, aby być na bieżąco z aktualnymi zasadami ochrony danych.
				</p>
			</section>
		</MainContainer>
	)
}

export default PrivacyPolicy
