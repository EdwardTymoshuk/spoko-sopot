'use client'

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import Head from 'next/head'
import MainContainer from '../components/MainContainer'
import PageHeaderContainer from '../components/PageHeaderComponent'

const OfferPage = () => {
	return (
		<MainContainer className="pt-20 pb-10">
			<Head>
				<title>Nasza Oferta | Restauracja Spoko</title>
				<meta
					name="description"
					content="Restauracja Spoko w Sopocie zaprasza na organizację wyjątkowych przyjęć nad Bałtykiem. Oferujemy różnorodne menu, usługi premium i idealne rozwiązania na każdą okazję."
				/>
				<meta
					name="keywords"
					content="organizacja przyjęć, oferta kulinarna, Restauracja Spoko, przyjęcia nad Bałtykiem, menu dla dzieci, usługi premium"
				/>
				<meta name="author" content="Restauracja Spoko" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<MaxWidthWrapper className='space-y-8'>
				<PageHeaderContainer
					title="Nasza Oferta"
					image="/img/offer-page.jpg"
					imageMobile="/img/offer-page-mobile.jpg"
					description="Restauracja Spoko Sopot zaprasza na niezapomniane przyjęcia nad brzegiem Bałtyku! Organizujemy wydarzenia dostosowane do każdej okazji – od kameralnych kolacji po wyjątkowe uroczystości rodzinne i firmowe. Zapoznaj się z naszą bogatą ofertą i skontaktuj się z nami, aby stworzyć idealne menu na Twoje przyjęcie."
				/>

				{/* Rodzaje Przyjęć */}
				<section className="space-y-2">
					<h2 className="text-xl font-bold text-secondary">Rodzaje Przyjęć</h2>
					<p>
						Organizujemy różnorodne przyjęcia, dostosowane do indywidualnych potrzeb:
					</p>
					<ul className="list-disc list-inside space-y-2">
						<li>
							Serwowana kolacja lub obiad z obsługą kelnerską:
							<ul className="list-none pl-6 space-y-1">
								<li>- Kolacja talerzowa – indywidualne dania z menu.</li>
								<li>- Kolacja półmiskowa – dania serwowane w stylu rodzinnym.</li>
							</ul>
						</li>
						<li>
							Obiad lub kolacja w formie bufetu – idealne dla większych grup.
						</li>
					</ul>

					<p className="text-sm text-primary italic">
						*Przyjęcia powyżej 20 osób realizujemy wyłącznie poza sezonem letnim.
					</p>
				</section>

				{/* Menu Główne */}
				<section className="space-y-2">
					<h2 className="text-xl font-bold text-secondary">Propozycje Menu</h2>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold">Przystawki</h3>
						<p>Bruschetta z tatarem z łososia, krewetki z guacamole czy ośmiornica z grillowanymi warzywami.</p>

						<h3 className="text-lg font-semibold">Zupy</h3>
						<p>
							Od kremu z pomidorów po tradycyjny rosół. Specjalność: zupa rybna na mleczku kokosowym.
						</p>

						<h3 className="text-lg font-semibold">Dania Główne</h3>
						<p>Opcje wegańskie, rybne i mięsne – roladki z kurczaka, łosoś na risotto.</p>

						<h3 className="text-lg font-semibold">Desery</h3>
						<p>Ciepła szarlotka, brownie i sernik Nowojorski.</p>
					</div>
				</section>

				{/* Premium i Dodatkowe Usługi */}
				<section>
					<h2 className="text-xl font-bold text-secondary">Usługi Premium i Dodatkowe</h2>
					<div className="space-y-2">
						<p>Specjalne dodatki: mini burgerki, sety bruschett czy tartaletki z kawiorem. Dla dzieci: mini burgery, paluszki rybne, pizza Margherita.</p>
					</div>
				</section>

				{/* Alkohol i Napoje */}
				<section>
					<h2 className="text-xl font-bold text-secondary">Napoje i Alkohol</h2>
					<p>Koktajle, dzbanki z drinkami, włoskie wina i mocne alkohole na butelki.</p>
				</section>

				{/* Sekcja Kontakt */}
				<div className="text-center mt-8">
					<p className="text-lg font-medium">Skontaktuj się z nami, aby uzyskać szczegółowe informacje lub zarezerwować termin</p>
					<p className="mt-4 text-secondary">
						Telefon: <a href="tel:+48123456789" className="underline">+48 123 456 789</a> | Email: <a href="mailto:info@spokosopot.pl" className="underline">info@spokosopot.pl</a>
					</p>
				</div>
			</MaxWidthWrapper>
		</MainContainer>
	)
}

export default OfferPage
