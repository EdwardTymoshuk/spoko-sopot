import {
  CarouselImage,
  MenuItemCategory,
  MongoDBReview,
  NavBarItem,
} from '@/app/types'

export const isOrderingOpen = false

export const NAVBAR_ITEMS: NavBarItem[] = [
  {
    label: 'O NAS',
    link: '/',
  },
  {
    label: 'OFERTA',
    link: '/offer',
  },
  {
    label: 'AKTUALNOŚCI',
    link: '/news',
  },
  {
    label: 'MENU',
    link: '/menu',
  },
  {
    label: 'GALERIA',
    link: '/gallery',
  },
  {
    label: 'KONTAKT',
    link: '/contact',
  },
]

export const CAROUSEL_MAIN_IMAGES: CarouselImage[] = [
  {
    src: '/img/carousel/carousel-1.jpg',
    srcMobile: '/img/carousel/carousel-1-mobile.jpg',
    eyebrow: 'Restauracja nad morzem',
    title: 'Spokojny smak Sopotu',
    description:
      'Śniadania, obiady, kolacje i spotkania przy stole kilka kroków od plaży.',
    primaryCta: {
      label: 'Zobacz menu',
      href: '/menu',
    },
    secondaryCta: {
      label: 'Zarezerwuj przyjęcie',
      href: 'https://spokosopot.pl/reservation',
      external: true,
    },
  },
  {
    src: '/img/carousel/carousel-2.jpg',
    srcMobile: '/img/carousel/carousel-2-mobile.jpg',
    eyebrow: 'Menu sezonowe',
    title: 'Karta pełna prostych, dobrych rzeczy',
    description:
      'Od śniadań po kolacje: kuchnia Spoko oparta na świeżych składnikach i swobodnej atmosferze.',
    primaryCta: {
      label: 'Przejdź do menu',
      href: '/menu',
    },
    secondaryCta: {
      label: 'Odwiedź nas',
      href: '/contact',
    },
  },
  {
    src: '/img/carousel/carousel-3.jpg',
    srcMobile: '/img/carousel/carousel-3-mobile.jpg',
    eyebrow: 'Przyjęcia i eventy',
    title: 'Zorganizuj spotkanie w Spoko',
    description:
      'Przygotujemy menu, oprawę i obsługę dla rodzinnych przyjęć, kolacji grupowych i wydarzeń firmowych.',
    primaryCta: {
      label: 'Zarezerwuj online',
      href: 'https://spokosopot.pl/reservation',
      external: true,
    },
    secondaryCta: {
      label: 'Zobacz ofertę',
      href: '/offer',
    },
  },
  {
    src: '/img/carousel/carousel-4.jpg',
    srcMobile: '/img/carousel/carousel-4-mobile.webp',
    eyebrow: 'Sopot, Hestii 3',
    title: 'Wpadnij na śniadanie, obiad albo wieczór ze znajomymi',
    description:
      'Codziennie blisko morza, w luźnym rytmie i z kartą, do której chce się wracać.',
    primaryCta: {
      label: 'Sprawdź lokalizację',
      href: '/contact',
    },
    secondaryCta: {
      label: 'Galeria',
      href: '/gallery',
    },
  },
]

export const OPINIONS: MongoDBReview[] = [
  {
    _id: '1',
    author: 'Edward T',
    date: '01.07.2024',
    message:
      'Restauracja Spoko w Sopocie to prawdziwa perełka nadmorskiej gastronomii. Położona w urokliwym miejscu, tuż przy plaży, oferuje nie tylko przepiękne widoki na morze, ale również doskonałą kuchnię. Menu jest różnorodne i zadowoli zarówno miłośników tradycyjnych polskich smaków, jak i tych poszukujących bardziej egzotycznych dań. Świeże składniki, profesjonalna obsługa i przyjazna atmosfera sprawiają, że każda wizyta w Spoko to wyjątkowe doświadczenie. To idealne miejsce na romantyczną kolację, spotkanie z przyjaciółmi czy rodzinny obiad. Gorąco polecam!',
    rating: 5,
  },
  {
    _id: '2',
    author: 'Julia B',
    date: '3 miesiący temu',
    message:
      'Dawno nie spotkaliśmy tak przemiłej i kontaktowej obsługi-to pierwszy aspekt, dla którego chce się wracać w takie miejsca! Po drugie-lokalizacja, myślę że siedząc latem na patio z widokiem na morze można się zakochać! Przechodząc do sedna-jedzenie. Uważam że sposób podania, kompozycje i jakość składników, którą jest wyczuwalna w każdym kęsie sprosta nawet najbardziej wymagającym podniebieniom :) Z pewnością wrócimy w to miejsce!',
    rating: 5,
  },
  {
    _id: '3',
    author: 'Pokochaj K',
    date: '2 miesiący temu',
    message:
      'Spoko miejsce z klimatem i smacznym jedzeniem. Nero Di Seria, Bowle z Kurczkiem, Spaghetti dla dzieci wyśmienite, zupa rybna klasyczna mogłaby być bardziej treściwa. Sangria i lemoniada mega orzeźwiające. Jestem na tak i wpadnę tu jeszcze będąc na kempingu.',
    rating: 4,
  },
  {
    _id: '4',
    author: 'Kinga B',
    date: '2 miesiący temu',
    message:
      'Cudowne miejsce z fantastyczną obsługa i atmosferą. Jedzenie przepyszne - polecam burgery, bardzo smaczna bułka i świeże składniki. Dodatkowo piękny widok na morze. Pani, która nas obsługiwała była uśmiechnięta, naturalna i niesamowicie kontaktowa. Mało jest już takich osób. Serdecznie dziękujemy za cudowne chwile. Ogromny plus na możliwość przyjścia z pupilami! ❤️ Pozdrawiamy serdecznie (buldożki francuskie Frania&Mia)♥️',
    rating: 5,
  },
  {
    _id: '5',
    author: 'Anna O',
    date: '5 miesięcy temu',
    message:
      'Super miejsce, a obiad mega pyszny. Najlepsza lemoniada jaka piłam. Dorsz z purée ziemniaczano bazyliowym i boczniakami po kaszubsku, palce lizać',
    rating: 5,
  },
  {
    _id: '6',
    author: 'Adam W',
    date: '14.07.2025',
    message: `
  Zrobiliśmy pit stop na  skromy posiłek.
  Rosół hmmmm odnieśliśmy wrażenie że kucharz próbował w jakiś cudowny sposób go rozmnożyć. Może to wypadek przy pracy.
  Generalnie był taki fit🫣.
  Frytki i zupa rybna petarda. 👌 polecamy
  Frytki niby nic takiego ale naprawdę mniam mniam.
  Duże uznanie za obsługę i atmosferę.
  Super naprawdę super. PROFESKA👌.
  Dobre powitanie ,rozmowa, malowanka dla juniora.
  Lux.
  Podsumowując .
  Zatrzymamy się na obiad w przyszłości.
  Magda i Adam i Jan😊`,
    rating: 5,
  },
  {
    _id: '7',
    author: 'Ewelina R',
    date: '14.07.2025',
    message: `
    Restauracja jest położona blisko plaży więc można iść na spacer po kolacji.
    Kolacja była pyszna, tak samo jak drinki i kawa. Pani Kelnerka przemiła.`,
    rating: 5,
  },
]

export const foodMenuItemCategories: MenuItemCategory[] = [
  'Śniadania',
  'Przystawki',
  'Zupy',
  'Dania główne',
  'Dania rybne',
  'Dania mięsne',
  'Owoce morza',
  'Burgery',
  'Makarony/Ravioli',
  'Bowle',
  'Vege',
  'Pizza',
  'Dla dzieci',
  'Dodatki',
  'Desery',
]

export const drinkMenuItemCategories: MenuItemCategory[] = [
  'Napoje zimne',
  'Drinki',
  'Klasyczne koktaile',
  'Na ciepło',
  'Herbata',
  'Kawa',
  'Whisky',
  'Rum',
  'Gin',
  'Tequila',
  'Cognac / Brandy',
  'Wódka',
  'Napoje alkoholowe',
  'Piwo beczkowe',
  'Piwo butelkowe',
  'Piwo bezalkoholowe',
  'Piwo smakowe',
  'Wina Białe',
  'Wina Czerwone',
  'Wina Musujące',
  'Wina Różowe',
  'Napoje',
  'Napoje bezalkoholowe',
  'Napoje łekkoprocentowe',
]

export const allowedCategories: MenuItemCategory[] = [
  ...foodMenuItemCategories,
  ...drinkMenuItemCategories,
  'Inne',
]

export const menuCategoryOrder = new Map(
  allowedCategories.map((category, index) => [category, index])
)

export const getMenuCategorySortIndex = (category: string) =>
  menuCategoryOrder.get(category as MenuItemCategory) ?? 999
