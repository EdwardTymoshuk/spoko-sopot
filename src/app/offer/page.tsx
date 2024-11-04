'use client'

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import MainContainer from '../components/MainContainer'
import PageHeaderContainer from '../components/PageHeaderComponent'

const OfferPage = () => {
	return (
		<MainContainer className="pt-20 pb-10">
			<MaxWidthWrapper className='space-y-8'>
				<PageHeaderContainer
					title="Nasza Oferta"
					image="/img/offer-page.jpg"
					description="Restauracja Spoko Sopot zaprasza na niezapomniane przyjęcia nad brzegiem Bałtyku! Organizujemy wydarzenia dostosowane do każdej okazji – od kameralnych kolacji po wyjątkowe uroczystości rodzinne i firmowe. Zapraszamy do zapoznania się z naszą bogatą ofertą kulinarną, przygotowaną z myślą o najwyższej jakości i wyjątkowych smakach. Skontaktuj się z nami, aby omówić szczegóły i stworzyć idealne menu na Twoje przyjęcie!"
				/>


				{/* Rodzaje Przyjęć */}
				<section className="space-y-2">
					<h2 className="text-xl font-bold text-secondary">Rodzaje Przyjęć</h2>
					<p>
						Organizujemy różnorodne przyjęcia na każdy gust. Do wyboru są dwa główne rodzaje przyjęć:
					</p>
					<ul className="list-disc list-inside space-y-2">
						<li>
							Serwowana kolacja lub obiad z obsługą kelnerską. Można wybrać:
							<ul className="list-none pl-6 space-y-1">
								<li>
									- Kolacja serwowana talerzowo – każdy z gości dostaje personalną przystawkę, zupę, danie główne i deser z poprzednio wybranego menu.
								</li>
								<li>
									- Kolacja serwowana w formie półmisków – półmiski serwowane są na środku stołu, a grupa dań przeznaczona jest dla 6 osób.
								</li>
							</ul>
						</li>
						<li>
							Obiad lub kolacja w formie bufetu z obsługą kelnerską w stylu “szwedzkiego stołu” – półmiski z różnorodnymi przystawkami, zupami i daniami głównymi.
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
						<p>Wybór przystawek obejmuje takie pozycje jak bruschetta z tatarem z łososia, krewetki z guacamole czy ośmiornica z grillowanymi warzywami.</p>

						<h3 className="text-lg font-semibold">Zupy</h3>
						<p>
							Nasza karta zup obejmuje zarówno opcje wegańskie, jak krem z pomidorów, jak i mięsne, takie jak tradycyjny rosół. Specjalnością jest zupa rybna na mleczku kokosowym.
						</p>

						<h3 className="text-lg font-semibold">Dania Główne</h3>
						<p>Proponujemy różnorodne dania główne, od wegańskich opcji, przez dania rybne, aż po mięsne, jak roladki z kurczaka czy łosoś na risotto.</p>

						<h3 className="text-lg font-semibold">Desery</h3>
						<p>Słodkie zakończenie każdego przyjęcia to m.in. szarlotka na ciepło, brownie i sernik Nowojorski.</p>
					</div>
				</section>

				{/* Premium i Dodatkowe Usługi */}
				<section>
					<h2 className="text-xl font-bold text-secondary">Usługi Premium i Dodatkowe</h2>
					<div className="space-y-2">
						<p>Nasza oferta obejmuje również specjalne dania premium i wyjątkowe dodatki, takie jak mini burgerki, sety bruschett czy tartaletki z kawiorem. Oferujemy też dania główne w formie półmisków oraz sałatki dla smakoszy.</p>
						<p>
							Dla dzieci przygotowaliśmy specjalne menu, w tym mini burgery, paluszki rybne i pizzę Margherita.
						</p>
					</div>
				</section>


				{/* Alkohol i Napoje */}
				<section>
					<h2 className="text-xl font-bold text-secondary">Napoje i Alkohol</h2>
					<p>Na przyjęciach oferujemy szeroki wybór napojów gazowanych, soków i koktajli. Specjalnością są nasze dzbanki z koktajlami, które idealnie sprawdzą się na większe przyjęcia.</p>
					<p className="">Do wyboru są również wina włoskie oraz możliwość zamówienia alkoholi mocnych na butelki.</p>
				</section>


				{/* Sekcja Kontakt */}
				<div className="text-center mt-8">
					<p className="text-lg font-medium">Skontaktuj się z nami, aby uzyskać szczegółowe informacje lub zarezerwować termin</p>
					<p className="mt-4 text-secondary">
						Telefon: <a href="tel:+48123456789" className="underline">+48 123 456 789</a> | Email: <a href="mailto:kontakt@spokosopot.pl" className="underline">info@spokosopot.pl</a>
					</p>
				</div>
			</MaxWidthWrapper>
		</MainContainer>
	)
}

export default OfferPage
