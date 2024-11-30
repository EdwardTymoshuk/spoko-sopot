// /app/about/page.tsx

import Image from 'next/image'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import PageHeaderContainer from '../components/PageHeaderComponent'

const AboutPage = () => {
	return (
		<MainContainer className='pt-20'>
			<MaxWidthWrapper>
				<PageHeaderContainer
					description='Nasza restauracja położona jest w sercu malowniczego Sopotu, z widokiem na Bałtyk. Tworzymy miejsce, gdzie smak i pasja spotykają się na każdym talerzu. Nasze menu to starannie skomponowane dania, łączące nowoczesną kuchnię europejską z nutą polskich smaków, które przyciągają zarówno miejscowych, jak i turystów.'
					title='O nas'
					image='/img/about-page.jpg'
					imageMobile='/img/about-page-mobile.jpg'
				/>

				<div className='my-12 flex flex-col md:flex-row-reverse items-center gap-8'>
					<div className='md:w-1/2'>
						<h2 className='text-3xl font-bold text-secondary mb-4'>Kilka słów od szefa kuchni</h2>
						<p className='text-lg text-text-foreground'>
							&quot;W kuchni staramy się, aby każdy składnik był traktowany z najwyższym szacunkiem, a danie nie tylko smakowało, ale i cieszyło oko. Jesteśmy dumni z naszej oferty, która powstała z myślą o wykorzystaniu lokalnych składników i najlepszych produktów dostępnych na polskim rynku.&quot;
						</p>
						<p className='mt-4 font-semibold'>— Lesia Voloshyna, Szef Kuchni Restauracji Spoko</p>
					</div>
					<div className='md:w-1/2 md:h-auto'>
						<Image
							src='/img/chef.png'
							alt='Lesia Voloshyna, Szef Kuchni'
							width={500}
							height={500}
							className=''
						/>
					</div>
				</div>

				<div className='my-12'>
					<div className='flex flex-col md:flex-row items-center gap-8'>
						<div className='md:w-1/2'>
							<h2 className='text-3xl font-bold text-secondary mb-4 text-center'>Nasz zespół</h2>
							<p className='text-lg text-text-foreground'>
								Nasza załoga to grupa pasjonatów, którzy dbają o każdy szczegół, aby zapewnić Wam niezapomniane doświadczenie kulinarne. Z uśmiechem witamy gości i staramy się, aby każda wizyta w naszej restauracji była wyjątkowa. Jesteśmy tutaj dla Was, aby sprawić, że każdy posiłek stanie się przyjemnością. Zapraszamy do odwiedzenia nas i odkrywania nowych smaków w przyjaznej atmosferze!
							</p>
						</div>
						<div className='md:w-1/2 md:h-auto'>
							<Image
								src='/img/team.jpg'
								alt='Zespół Restauracji Spoko'
								width={500}
								height={500}
								className=''
							/>
						</div>
					</div>
				</div>
			</MaxWidthWrapper>
		</MainContainer>
	)
}

export default AboutPage
