import { CarouselImage, MenuItem, NavBarItem, Opinion } from '@/app/types'


export const NAVBAR_ITEMS: NavBarItem[] = [
	{
		label: 'GŁÓWNA',
		link: '/',
	},
	{
		label: 'O NAS',
		link: '/about'
	},
	{
		label: 'OFERTA',
		link: '/offer'
	},
	{
		label: 'MENU',
		link: '/menu'
	},
	{
		label: 'GALERIA',
		link: '/galery'
	},
	{
		label: 'KONTAKT',
		link: '/contact'
	},
]

export const CAROUSEL_MAIN_IMAGES: CarouselImage[] = [
	{ src: '/img/carousel-1.jpg' },
	{ src: '/img/carousel-2.jpg' },
]

export const OPINIONS: Opinion[] = [
	{
		author: 'Edward T',
		date: '01.07.2024',
		message: 'Restauracja Spoko w Sopocie to prawdziwa perełka nadmorskiej gastronomii. Położona w urokliwym miejscu, tuż przy plaży, oferuje nie tylko przepiękne widoki na morze, ale również doskonałą kuchnię. Menu jest różnorodne i zadowoli zarówno miłośników tradycyjnych polskich smaków, jak i tych poszukujących bardziej egzotycznych dań. Świeże składniki, profesjonalna obsługa i przyjazna atmosfera sprawiają, że każda wizyta w Spoko to wyjątkowe doświadczenie. To idealne miejsce na romantyczną kolację, spotkanie z przyjaciółmi czy rodzinny obiad. Gorąco polecam!',
		rate: 5,
	},
	{
		author: 'Julia B',
		date: '3 miesiący temu',
		message: 'Dawno nie spotkaliśmy tak przemiłej i kontaktowej obsługi-to pierwszy aspekt, dla którego chce się wracać w takie miejsca! Po drugie-lokalizacja, myślę że siedząc latem na patio z widokiem na morze można się zakochać! Przechodząc do sedna-jedzenie. Uważam że sposób podania, kompozycje i jakość składników, którą jest wyczuwalna w każdym kęsie sprosta nawet najbardziej wymagającym podniebieniom :) Z pewnością wrócimy w to miejsce!',
		rate: 5,
	},
	{
		author: 'Pokochaj K',
		date: '2 miesiący temu',
		message: 'Spoko miejsce z klimatem i smacznym jedzeniem. Nero Di Seria, Bowle z Kurczkiem, Spaghetti dla dzieci wyśmienite, zupa rybna klasyczna mogłaby być bardziej treściwa. Sangria i lemoniada mega orzeźwiające. Jestem na tak i wpadnę tu jeszcze będąc na kempingu.',
		rate: 4,
	},
	{
		author: 'Kinga B',
		date: '2 miesiący temu',
		message: 'Cudowne miejsce z fantastyczną obsługa i atmosferą. Jedzenie przepyszne - polecam burgery, bardzo smaczna bułka i świeże składniki. Dodatkowo piękny widok na morze. Pani, która nas obsługiwała była uśmiechnięta, naturalna i niesamowicie kontaktowa. Mało jest już takich osób. Serdecznie dziękujemy za cudowne chwile. Ogromny plus na możliwość przyjścia z pupilami! ❤️ Pozdrawiamy serdecznie (buldożki francuskie Frania&Mia)♥️',
		rate: 5,
	},
	{
		author: 'Anna O',
		date: '5 miesięcy temu',
		message: 'Super miejsce, a obiad mega pyszny. Najlepsza lemoniada jaka piłam. Dorsz z purée ziemniaczano bazyliowym i boczniakami po kaszubsku, palce lizać',
		rate: 5,
	},
]

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Tatar z łososia (500g)',
		price: 42,
		description: 'Ręcznie siekany świeży łosoś / cebula czerwona / świeży ogórek / musztarda francuska / sos sojowy / pieczywo',
		category: 'Przystawki',
		image: '/img/menu/tatar-z-lososia.jpg'
	},
	{
		name: 'SHAKSHUKA VEGE (500G)',
		price: 39,
		description: '3 jajka sadzone / salsa pomidorowa z fasolką i ciecierzycą /cebula /marchewka / pieczywo / masło',
		category: 'Śniadania',
		image: '/img/menu/shakshuka-wege.jpg'
	},
	{
		name: 'Tatar z łososia (500g)',
		price: 42,
		description: 'Ręcznie siekany świeży łosoś / cebula czerwona / świeży ogórek / musztarda francuska / sos sojowy / pieczywo',
		category: 'Przystawki',
		image: '/img/menu/tatar-z-lososia.jpg'
	},
	{
		name: 'SHAKSHUKA VEGE (500G)',
		price: 39,
		description: '3 jajka sadzone / salsa pomidorowa z fasolką i ciecierzycą /cebula /marchewka / pieczywo / masło',
		category: 'Śniadania',
		image: '/img/menu/shakshuka-wege.jpg'
	},

]