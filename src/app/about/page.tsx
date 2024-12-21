// /app/about/page.tsx

import Head from 'next/head'
import Image from 'next/image'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import PageHeaderContainer from '../components/PageHeaderComponent'

// About page component for Spoko Restaurant
const AboutPage = () => {
	return (
		<>
			<Head>
				<title>O nas | Restauracja Spoko</title>
				<meta
					name="description"
					content="Restauracja Spoko w Sopocie – wyjątkowe smaki i niezapomniana atmosfera. Odkryj nasze menu inspirowane kuchnią europejską i lokalnymi składnikami!"
				/>
				<meta
					name="keywords"
					content="Restauracja Spoko, Sopot restauracja, Restauracja w Sopocie, Restauracja Sopot, Restauracja nad morzem, Restauracja z widokiem na morze, o nas, europejska kuchnia, polskie smaki"
				/>
				<meta name="author" content="Restauracja Spoko" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{/* Open Graph metadata for social sharing */}
				<meta property="og:title" content="O nas | Restauracja Spoko" />
				<meta
					property="og:description"
					content="Restauracja Spoko w Sopocie oferuje wyjątkowe smaki kuchni lokalnej i europejskiej. Odwiedź nas i poczuj niepowtarzalną atmosferę!"
				/>
				<meta property="og:image" content="/img/about-page.jpg" />
				<meta property="og:type" content="website" />
			</Head>
			<MainContainer className='pt-20'>
				<MaxWidthWrapper>
					{/* Page header with title, description, and images */}
					<PageHeaderContainer
						description='Nasza restauracja Spoko to wyjątkowe miejsce w sercu malowniczego Sopotu z widokiem na Bałtyk. Oferujemy nowoczesne dania kuchni europejskiej wzbogacone o polskie smaki, tworzone z lokalnych składników najwyższej jakości. Każde danie przygotowujemy z pasją i dbałością o szczegóły, aby zachwycić zarówno smakiem, jak i estetyką. Odwiedź nas i przekonaj się, dlaczego jesteśmy ulubionym miejscem zarówno mieszkańców, jak i turystów.'
						title='O nas'
						image='/img/about-page.jpg'
						imageMobile='/img/about-page-mobile.jpg'
					/>

					{/* Section about the chef */}
					<div className='my-12 flex flex-col md:flex-row-reverse items-center gap-8'>
						<div className='md:w-1/2'>
							<h2 className='text-3xl font-bold text-secondary mb-4'>Kilka słów od szefa kuchni</h2>
							<p className='text-lg text-text-foreground'>
								&quot;W naszej kuchni każdy składnik jest traktowany z najwyższym szacunkiem. Stawiamy na lokalne produkty oraz innowacyjne podejście, aby tworzyć dania, które nie tylko smakują, ale także zachwycają wizualnie. Nasza oferta to połączenie tradycyjnych polskich smaków z nowoczesnymi trendami kulinarnymi. Serdecznie zapraszamy do odkrywania naszych specjałów!&quot;
							</p>
							<p className='mt-4 font-semibold'>— Lesia Voloshyna, Szef Kuchni Restauracji Spoko</p>
						</div>
						<div className='md:w-1/2 md:h-auto'>
							<Image
								src='/img/chef.png'
								alt='Lesia Voloshyna, szef kuchni Restauracji Spoko'
								width={500}
								height={500}
							/>
						</div>
					</div>

					{/* Section about the team */}
					<div className='my-12'>
						<div className='flex flex-col md:flex-row items-center gap-8'>
							<div className='md:w-1/2'>
								<h2 className='text-3xl font-bold text-secondary mb-4 text-center'>Nasz zespół</h2>
								<p className='text-lg text-text-foreground'>
									Nasz zespół to doświadczeni pasjonaci kulinariów, którzy dbają o każdy szczegół – od przyjaznego powitania po perfekcyjnie przygotowane dania. Dzięki naszej pracy tworzymy miejsce, gdzie każdy gość czuje się wyjątkowo. Oferujemy ciepłą, przyjazną atmosferę, która sprawia, że każda wizyta w Restauracji Spoko staje się niezapomnianym przeżyciem. Przyjdź i doświadcz kulinarnej magii, jaką tworzymy specjalnie dla Ciebie!
								</p>
							</div>
							<div className='md:w-1/2 md:h-auto'>
								<Image
									src='/img/team.jpg'
									alt='Zespół kulinarny Restauracji Spoko w Sopocie'
									width={500}
									height={500}
								/>
							</div>
						</div>
					</div>
				</MaxWidthWrapper>
			</MainContainer>
		</>
	)
}

export default AboutPage
