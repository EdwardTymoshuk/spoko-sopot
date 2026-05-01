//src/lib/consts.ts

import ColdPlateStep from '@/app/components/reservation/steps/ColdPlateStep'
import DateGuestsStep from '@/app/components/reservation/steps/DateGuestsStep'
import DecorationsStep from '@/app/components/reservation/steps/DecorationsStep'
import DessertsStep from '@/app/components/reservation/steps/DessertsStep'
import HallExclusivityStep from '@/app/components/reservation/steps/HallExclusivityStep'
import PackageStep from '@/app/components/reservation/steps/PackagesStep/PackageStep'
import PremiumMainStep from '@/app/components/reservation/steps/PremiumMainStep'
import AlcoholStep from '@/app/components/reservation/steps/AlcoholStep'
import SoftDrinksStep from '@/app/components/reservation/steps/SoftDrinksStep'
import SummarySubmitStep from '@/app/components/reservation/steps/SummarySubmitStep'
import ThankYouStep from '@/app/components/reservation/steps/ThankYouStep'
import WelcomeStep from '@/app/components/reservation/steps/WelcomeStep'
import {
  PackageType,
  ReservationDraft,
  SoupChoice,
} from '@/app/types/reservation'

//RESERVATION
export const STEP_COMPONENTS: Record<string, React.FC> = {
  welcome: WelcomeStep,
  'date-guests': DateGuestsStep,
  package: PackageStep,
  'cold-plate': ColdPlateStep,
  'premium-main': PremiumMainStep,
  desserts: DessertsStep,
  'soft-drinks': SoftDrinksStep,
  alcohol: AlcoholStep,
  'hall-exclusivity': HallExclusivityStep,
  decorations: DecorationsStep,
  summary: SummarySubmitStep,
  'thank-you': ThankYouStep,
}

export const RESERVATION_STEPS = [
  {
    key: 'date-guests',
    label: 'Data i liczba gości',
    isValid: (draft: ReservationDraft) => {
      const start = parseTimeToDecimalHour(draft.eventStartTime)
      const end = parseTimeToDecimalHour(draft.eventEndTime)

      return (
        Boolean(draft.eventDate) &&
        typeof draft.adultsCount === 'number' &&
        draft.adultsCount >= 12 &&
        start !== null &&
        end !== null &&
        end > start &&
        !draft.dateGuestsCapacityExceeded &&
        ((draft.children3to12Count ?? 0) === 0 ||
          Boolean(draft.childrenMenuOption))
      )
    },
  },
  {
    key: 'package',
    label: 'Pakiet',
    isValid: (draft: ReservationDraft) => {
      if (!draft.packageType) return false

      if (draft.packageType === 'platinum') {
        if (draft.wantsSoup && !draft.soupChoice) return false
      } else if (!draft.soupChoice) {
        return false
      }

      if (draft.specialDiets?.includes('other')) {
        return Boolean(
          draft.specialDietComment && draft.specialDietComment.trim().length > 0
        )
      }

      return true
    },
  },
  {
    key: 'cold-plate',
    label: 'Zimna płyta',
    isValid: (draft: ReservationDraft) => {
      const guests = getColdPlateEquivalentGuests(draft)
      if (guests < 1) return true

      const minSets = Math.ceil(guests / 6)
      const setValues = Object.values(draft.coldPlateSelections ?? {})
      const saladValues = Object.values(draft.coldPlateSaladSelections ?? {})

      const hasAnySelection = [...setValues, ...saladValues].some(
        (value) => value > 0
      )

      if (!hasAnySelection) return true

      const isAnyBelowMin = [...setValues, ...saladValues].some(
        (value) => value > 0 && value < minSets
      )

      return !isAnyBelowMin
    },
  },
  {
    key: 'premium-main',
    label: 'Półmiski Premium',
    isValid: () => true,
  },
  {
    key: 'desserts',
    label: 'Desery i tort',
    isValid: (draft: ReservationDraft) => {
      if (!draft.cakeOption) return false

      const selections = draft.dessertSelections ?? {}

      for (const option of DESSERT_OPTIONS) {
        const qty = selections[option.id] ?? 0
        if (qty > 0 && option.minQty && qty < option.minQty) {
          return false
        }
      }

      return true
    },
  },
  {
    key: 'soft-drinks',
    label: 'Napoje bezalkoholowe',
    isValid: () => true,
  },
  {
    key: 'alcohol',
    label: 'Alkohol',
    isValid: () => true,
  },
  {
    key: 'hall-exclusivity',
    label: 'Wyłączność sali',
    isValid: (draft: ReservationDraft) => {
      if (draft.hallExclusivity === 'no') return true
      if (draft.hallExclusivity !== 'yes') return false

      const start = parseTimeToDecimalHour(draft.eventStartTime)
      const end = parseTimeToDecimalHour(draft.eventEndTime)
      if (start === null || end === null) return false
      if (draft.hallExclusivityUnavailable) return false

      return end > start
    },
  },
  {
    key: 'decorations',
    label: 'Dekoracja stołu',
    isValid: () => true,
  },
  {
    key: 'summary',
    label: 'Podsumowanie',
    isValid: () => true,
  },
  {
    key: 'thank-you',
    label: 'Dziękujemy',
    isValid: () => true,
  },
] as const

export const getColdPlateEquivalentGuests = (draft: ReservationDraft) => {
  const adults = draft.adultsCount ?? 0
  const children3to12 = draft.children3to12Count ?? 0

  if (draft.childrenMenuOption === 'half_package') {
    return adults + children3to12 * 0.5
  }

  return adults
}

type HallExclusivityRateSegment = {
  startHour: number
  endHour: number
  weekdayRate: number
  weekendRate: number
}

const HALL_EXCLUSIVITY_RATE_SEGMENTS: HallExclusivityRateSegment[] = [
  { startHour: 10, endHour: 13, weekdayRate: 163, weekendRate: 604 },
  { startHour: 14, endHour: 19, weekdayRate: 326, weekendRate: 1207 },
]

export function parseTimeToDecimalHour(value?: string | null) {
  if (!value) return null

  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null

  const hours = Number(match[1])
  const minutes = Number(match[2])

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    (minutes !== 0 && minutes !== 30)
  ) {
    return null
  }

  return hours + minutes / 60
}

export function calculateHallExclusivityCharge(params: {
  eventDate?: Date | string | null
  wantsExclusivity?: boolean
  startTime?: string | null
  endTime?: string | null
}) {
  const { eventDate, wantsExclusivity, startTime, endTime } = params
  if (!wantsExclusivity || !eventDate) {
    return { total: 0, billableHours: 0 }
  }

  const date = eventDate instanceof Date ? eventDate : new Date(eventDate)
  if (Number.isNaN(date.getTime())) {
    return { total: 0, billableHours: 0 }
  }

  const start = parseTimeToDecimalHour(startTime)
  const end = parseTimeToDecimalHour(endTime)
  if (start === null || end === null || end <= start) {
    return { total: 0, billableHours: 0 }
  }

  const day = date.getDay() // 0-6, where 0 = Sunday
  const isWeekend = day === 0 || day === 5 || day === 6

  let total = 0
  let billableHours = 0

  for (const segment of HALL_EXCLUSIVITY_RATE_SEGMENTS) {
    const overlapStart = Math.max(start, segment.startHour)
    const overlapEnd = Math.min(end, segment.endHour)
    const hours = Math.max(0, overlapEnd - overlapStart)

    if (hours > 0) {
      const rate = isWeekend ? segment.weekendRate : segment.weekdayRate
      total += hours * rate
      billableHours += hours
    }
  }

  return {
    total: Math.round(total),
    billableHours,
  }
}

export interface PackageConfig {
  type: PackageType
  title: string
  price: number
  badge?: string

  summary: string[]

  extensionPricePerHour: number

  details: {
    appetizers: string[]
    soup?: {
      mode: 'required' | 'optional'
      pricePerPerson?: number
      choices: { label: string; value: SoupChoice }[]
    }
    main: string[]
    desserts: string[]
    drinks: string[]
  }
}

export const PACKAGES: PackageConfig[] = [
  {
    type: 'silver',
    title: 'Silver',
    price: 199,
    extensionPricePerHour: 500,

    summary: [
      'Przystawka dla każdego gościa',
      'Zupa (jedna dla wszystkich)',
      'Danie główne (indywidualnie)',
      'Deser',
      'Woda bez limitu',
    ],

    details: {
      appetizers: [
        'Bruschetta z musem z awokado i krewetką – 1 szt.',
        'Bruschetta z pesto bazyliowym i prosciutto crudo – 1 szt.',
        '| podana indywidualnie dla każdego gościa',
      ],

      soup: {
        mode: 'required',
        choices: [
          {
            label: 'Krem z pomidora z bazyliowym pesto',
            value: 'tomato_cream',
          },
          {
            label: 'Rosół z kury z makaronem',
            value: 'chicken_broth',
          },
        ],
      },

      main: [
        'Roladka z kurczaka nadziewana wędzonym serem, owinięta bekonem, puree ziemniaczane z parmezanem, brokuł bimi, aromatyczna zielona oliwa',
        'lub',
        'Miękka wolno pieczona karkówka, rozpływająca się w ustach, w sosie z leśnych grzybów; podawana z kremowym gratinem ziemniaczanym, delikatnie skropionym oliwą szczypiorkową',
        '| wybór jednego dania dla wszystkich gości (wybór obowiązkowy)',
      ],

      desserts: [
        'Sernik nowojorski z konfiturą wiśniową oraz sezonowymi owocami',
      ],

      drinks: ['Woda niegazowana w dzbankach – bez limitu'],
    },
  },

  {
    type: 'gold',
    title: 'Gold',
    price: 219,
    extensionPricePerHour: 400,
    badge: 'Najczęściej wybierany',

    summary: [
      'Przystawka dla każdego gościa',
      'Zupa (jedna dla wszystkich)',
      'Dania główne na półmiskach',
      'Desery na stół',
      'Woda bez limitu',
    ],

    details: {
      appetizers: [
        'Bruschetta z musem z awokado i krewetką – 1 szt.',
        'Bruschetta z pesto bazyliowym i prosciutto crudo – 1 szt.',
        '| podana indywidualnie dla każdego gościa',
      ],

      soup: {
        mode: 'required',
        choices: [
          {
            label: 'Krem z pomidora z bazyliowym pesto',
            value: 'tomato_cream',
          },
          {
            label: 'Rosół z kury z makaronem',
            value: 'chicken_broth',
          },
        ],
      },

      main: [
        'Półmisek mięs:',
        'Żeberka wieprzowe',
        'Grillowana karkówka',
        'Roladka z kurczaka z wędzonym serem i suszonymi pomidorami, owinięta boczkiem',
        'Dodatki:',
        'Ziemniaczki pieczone',
        'Ziemniaki duszone z zasmażką z boczku, cebuli, pieczarek i koperku',
        'Surówki: coleslaw, z marchewki, z buraczków',
        'Sosy: spicy mayo, salsa mexicana',
        '+ sos tatarski',
        '| półmiski serwowane w środkach stołu',
      ],

      desserts: [
        'Sernik',
        'Szarlotka',
        'Brownie',
        'Owoce sezonowe',
        '| patery w środkach stołu',
      ],

      drinks: ['Woda niegazowana w dzbankach – bez limitu'],
    },
  },

  {
    type: 'platinum',
    title: 'Platinum',
    price: 249,
    extensionPricePerHour: 300,

    summary: [
      'Bogate przystawki na stół',
      'Dania główne na półmiskach',
      'Desery na stół',
      'Woda bez limitu',
      'Zupa opcjonalnie (+12 zł / osoba)',
    ],

    details: {
      appetizers: [
        'Set bruschett:',
        'Bruschetta z oscypkiem i żurawiną',
        'Bruschetta z karmelizowaną gruszką i gorgonzolą',
        'Bruschetta z prosciutto crudo i pesto bazyliowym',
        'Set mini naleśników:',
        'Z kurczakiem, pieczarkami i serem',
        'Z szarpaną łopatką',
        'Ze szpinakiem i mozzarellą',
        'Set mini croissantów:',
        'Z kurczakiem, sałatą, pomidorkami cherry, cheddarem i sosem tatarskim',
        'Z pieczoną szynką, serem goudą i świeżym ogórkiem',
        'Z pieczonym burakiem, serem kozim i miodem',
        'Sałatka Cezarska z kurczakiem (sałata rzymska, sos cezar, grillowany kurczak, jajka przepiórcze, pomidorki cherry, grillowany bekon, parmezan, grzanki żytnie)',
        '| półmiski serwowane w środkach stołu',
      ],

      soup: {
        mode: 'optional',
        pricePerPerson: 12,
        choices: [
          {
            label: 'Krem z pomidora z bazyliowym pesto',
            value: 'tomato_cream',
          },
          {
            label: 'Rosół z kury z makaronem',
            value: 'chicken_broth',
          },
        ],
      },

      main: [
        'Półmisek mięs:',
        'Żeberka wieprzowe',
        'Grillowana karkówka',
        'Panierowane polędwiczki z kurczaka',
        'Dodatki:',
        'Ziemniaczki pieczone + sos tatarski',
        'Ziemniaki duszone z zasmażką z boczku, cebuli, pieczarek i koperku',
        'Surówki: coleslaw, z marchewki, z buraczków',
        'Sosy: spicy mayo, ketchup',
        '| półmiski serwowane w środkach stołu',
      ],

      desserts: [
        'Sernik',
        'Szarlotka',
        'Brownie',
        'Owoce sezonowe',
        '| patery w środkach stołu',
      ],

      drinks: ['Woda niegazowana w dzbankach – bez limitu'],
    },
  },
]

export interface ColdPlateSet {
  id: string
  title: string
  description: string[]
  price: number
}

export interface ColdPlateSalad {
  id: string
  title: string
  description: string
  price: number
}

export interface PremiumMainPlatter {
  id: string
  title: string
  description: string[]
  sauces?: string[]
  price: number
}

export interface PremiumMainSideOption {
  id: string
  label: string
  price: number
}

export interface PremiumMainSideSection {
  id: string
  title: string
  options: PremiumMainSideOption[]
}

export interface DessertOption {
  id: string
  title: string
  description: string
  category: 'cake_platters' | 'mini_desserts'
  unitLabel: string
  minQty?: number
  price: number
}

export interface SoftDrinkOption {
  id: string
  title: string
  description: string
  volumeLabel: string
  price: number
  recommendation?: string
}

export interface AlcoholOption {
  id: string
  title: string
  volumeLabel: string
  price: number
}

export const COLD_PLATE_SETS: ColdPlateSet[] = [
  {
    id: 'bruschetta',
    title: '🧀 Set Bruschett',
    price: 69,
    description: [
      'Bruschetta z oscypkiem i żurawiną – 3 szt.',
      'Bruschetta z karmelizowaną gruszką i gorgonzolą – 3 szt.',
      'Bruschetta z prosciutto crudo i pesto – 3 szt.',
    ],
  },
  {
    id: 'tatar',
    title: '🐟 Set Słoików Tatarów',
    price: 109,
    description: [
      'Tatar z łososia – 200 g',
      'Tatar wołowy – 200 g',
      'Tatar ze śledzia – 200 g',
    ],
  },
  {
    id: 'tartaletki',
    title: '🍰 Set Mini Tartaletek',
    price: 69,
    description: [
      'z pastą z łososia – 6 szt.',
      'z pastą z makreli – 6 szt.',
      'z pastą z tuńczyka – 6 szt.',
    ],
  },
  {
    id: 'mini-burgery',
    title: '🍔 Set Mini Burgerów',
    price: 149,
    description: [
      'mini burger z kurczakiem – 6 szt.',
      'mini burger z dorszem – 6 szt.',
    ],
  },
  {
    id: 'krewetki',
    title: '🔥 Krewetki z ogniem',
    price: 62,
    description: [
      'krewetki smażone w sosie autorskim – 8 szt.',
      'grillowane grzanki w zestawie',
    ],
  },
  {
    id: 'mini-nalesniki',
    title: '🥞 Set Mini Naleśników',
    price: 109,
    description: [
      'z kurczakiem, pieczarkami i serem – 3 szt.',
      'z szarpaną łopatką – 3 szt.',
      'ze szpinakiem i mozzarellą – 3 szt.',
    ],
  },
  {
    id: 'mini-croissanty',
    title: '🥐 Set Mini Croissantów',
    price: 69,
    description: [
      'z kurczakiem, sałatą, pomidorkami cherry i sosem tatarskim – 3 szt.',
      'z pieczoną szynką, serem gouda i świeżym ogórkiem – 3 szt.',
      'z pieczonym burakiem, serem kozim i miodem – 3 szt.',
    ],
  },
  {
    id: 'szaszlyki-krewetki',
    title: '🍤 Szaszłyki z krewetkami i ananasem',
    price: 219,
    description: [
      '1 porcja = 1 szaszłyk (2 grillowane krewetki + 3 kawałki świeżego ananasa)',
      '1 półmisek = 12 szaszłyków',
    ],
  },
  {
    id: 'dary-morza',
    title: '🌊 Set „Dary Morza” – półmisek',
    price: 169,
    description: [
      'panierowane krewetki butterfly – 5 szt.',
      'panierowane kalmary – 5 krążków',
      'panierowane fileciki z dorsza – 5 szt.',
      'sos tatarski w zestawie',
    ],
  },
  {
    id: 'tataki-tunczyk',
    title: '🐟 Tataki z tuńczyka',
    price: 62,
    description: [
      'delikatnie opiekany tuńczyk, podawany na zimno',
      'sos sezamowo-sojowy',
    ],
  },
  {
    id: 'tartaletki-kawiorem',
    title: '🥟 Tartaletki z kawiorem',
    price: 229,
    description: ['chrupiące tartaletki z kremowym nadzieniem i kawiorem'],
  },
]

export const COLD_PLATE_SALADS: ColdPlateSalad[] = [
  {
    id: 'caesar_chicken',
    title: '🥗 Sałatka Cesarska z Kurczakiem – 500 g',
    description:
      'Sałata rzymska, sos cesarski, grillowany kurczak, jajka przepiórcze, pomidorki cherry, grillowany bekon, parmezan, grzanki żytnie.',
    price: 89,
  },
  {
    id: 'caesar_shrimp',
    title: '🍤 Sałatka Cesarska z Krewetkami – 500 g',
    description:
      'Sałata rzymska, sos cesarski, grillowane krewetki, jajka przepiórcze, pomidorki cherry, świeże awokado, parmezan, grzanki żytnie.',
    price: 99,
  },
  {
    id: 'greek',
    title: '🇬🇷 Sałatka Grecka – 500 g',
    description:
      'Ser feta, świeży ogórek, pomidor, świeża papryka, krążki czerwonej cebuli, oliwki, oliwa z oliwek, oregano.',
    price: 79,
  },
  {
    id: 'smoked_chicken',
    title: '🥓 Sałatka z Wędzonym Kurczakiem',
    description:
      'Minimalne zamówienie: 2 miski (2 porcje). Wędzona pierś z kurczaka, jajko gotowane, ser gouda, pieczarki marynowane, piklowany ogórek, majonez.',
    price: 85,
  },
]

export const PREMIUM_MAIN_PLATTERS: PremiumMainPlatter[] = [
  {
    id: 'meat_1',
    title: '🍖 Półmisek Mięs Nr 1',
    description: [
      'Soczyste żeberka wieprzowe',
      'Grillowana karkówka',
      'Roladka z kurczaka z wędzonym serem i suszonymi pomidorami, owinięta boczkiem',
    ],
    sauces: ['spicy mayo', 'salsa mexicana'],
    price: 129,
  },
  {
    id: 'meat_2',
    title: '🍗 Półmisek Mięs Nr 2',
    description: [
      'Żeberka wieprzowe',
      'Grillowana karkówka',
      'Panierowane polędwiczki z kurczaka',
    ],
    sauces: ['spicy mayo', 'ketchup'],
    price: 149,
  },
  {
    id: 'fish',
    title: '🐟 Półmisek Ryb',
    description: [
      'Pieczony dorsz i pieczony łosoś – po 75 g na osobę',
      'Podawane na ciepło',
    ],
    sauces: ['tatarski', 'tzatziki'],
    price: 199,
  },
  {
    id: 'seafood',
    title: '🌊 Półmisek Owoców Morza w Sosie',
    description: [
      'Krewetki, mule czarne i vongole, ośmiorniczki baby oraz raki',
      'Duszone w autorskim winno-maślanym sosie z kefirem',
      'Podawane z grillowaną bagietką i cytryną',
    ],
    price: 149,
  },
  {
    id: 'mix',
    title: '😈 Półmisek Rozpusty',
    description: [
      'Panierowany dorsz, krążki kalmara i krewetki butterfly',
      'Podawane na frytkach belgijskich',
    ],
    sauces: ['tatarski', 'ketchup'],
    price: 119,
  },
]

export const PREMIUM_MAIN_SIDE_OPTIONS: PremiumMainSideSection[] = [
  {
    id: 'starchy',
    title: '🥔 Dodatki skrobiowe',
    options: [
      {
        id: 'baked_potatoes',
        label: 'Ziemniaczki pieczone z sosem tatarskim - 600 g',
        price: 79,
      },
      {
        id: 'mashed_parmesan',
        label: 'Puree ziemniaczane z parmezanem - 600 g',
        price: 75,
      },
      {
        id: 'fries',
        label: 'Frytki belgijskie z ketchupem - 600 g',
        price: 69,
      },
      {
        id: 'potato_gratin',
        label: 'Gratin ziemniaczany zapiekany z serem mozzarella - 600 g',
        price: 89,
      },
      {
        id: 'boiled_potatoes_bacon',
        label: 'Ziemniaki z zasmażką z boczku, cebuli, pieczarek i koperku - 600 g',
        price: 79,
      },
    ],
  },
  {
    id: 'hot_veggies',
    title: '🥦 Dodatki warzywne na ciepło',
    options: [
      { id: 'grilled_veggies', label: 'Warzywa grillowane - 600 g', price: 89 },
      { id: 'veggies_butter', label: 'Bukiet warzyw na masełku - 600 g', price: 79 },
    ],
  },
  {
    id: 'salads',
    title: '🥗 Surówki',
    options: [
      { id: 'coleslaw', label: 'Coleslaw - 150 g', price: 9 },
      { id: 'carrot_apple', label: 'Marchewka z jabłkiem - 150 g', price: 9 },
      { id: 'beetroot', label: 'Buraczki - 150 g', price: 9 },
      { id: 'sauerkraut', label: 'Surówka z kiszonej kapusty - 150 g', price: 9 },
      { id: 'fresh_veggie_salad', label: 'Sałatka ze świeżych warzyw - 150 g', price: 9 },
    ],
  },
]

export const DESSERT_OPTIONS: DessertOption[] = [
  {
    id: 'cake_trio_platter',
    title: 'Sernik + szarlotka + brownie',
    description: 'Sernik, szarlotka i brownie podawane ze świeżymi owocami.',
    category: 'cake_platters',
    unitLabel: 'set',
    price: 189,
  },
  {
    id: 'mini_tiramisu',
    title: '☕ Set mini tiramisu',
    description: 'Mini desery - idealne na dłuższe przyjęcia.',
    category: 'mini_desserts',
    unitLabel: 'szt.',
    minQty: 20,
    price: 16,
  },
  {
    id: 'mini_panna_cotta',
    title: '🍮 Set mini panna cotta',
    description: 'Mini desery - idealne na dłuższe przyjęcia.',
    category: 'mini_desserts',
    unitLabel: 'szt.',
    minQty: 20,
    price: 15,
  },
  {
    id: 'mini_chia',
    title: '🌱 Set mini pudding chia',
    description: 'Mini desery - idealne na dłuższe przyjęcia.',
    category: 'mini_desserts',
    unitLabel: 'szt.',
    minQty: 20,
    price: 15,
  },
]

export const SOFT_DRINK_OPTIONS: SoftDrinkOption[] = [
  {
    id: 'apple_juice_jug',
    title: 'Sok jabłkowy w dzbanku',
    description: 'Dzbanek',
    volumeLabel: '1 l',
    price: 30,
    recommendation: 'Rekomendujemy około 1 dzbanek na 6 osób dorosłych.',
  },
  {
    id: 'orange_juice_jug',
    title: 'Sok pomarańczowy w dzbanku',
    description: 'Dzbanek',
    volumeLabel: '1 l',
    price: 30,
    recommendation: 'Rekomendujemy około 1 dzbanek na 6 osób dorosłych.',
  },
  {
    id: 'lemonade_jug',
    title: 'Lemoniada',
    description: 'Dzbanek',
    volumeLabel: '1.5 l',
    price: 62,
    recommendation: 'Rekomendujemy około 1 dzbanek na 6 osób dorosłych.',
  },
  {
    id: 'cola_bottle',
    title: 'Cola',
    description: 'Butelka',
    volumeLabel: '850 ml',
    price: 25,
    recommendation:
      'Ilość coli najlepiej dopasować do liczby osób, które planują spożywać alkohol.',
  },
  {
    id: 'cola_zero_bottle',
    title: 'Cola Zero',
    description: 'Butelka',
    volumeLabel: '850 ml',
    price: 25,
    recommendation:
      'Ilość coli najlepiej dopasować do liczby osób, które planują spożywać alkohol.',
  },
]

export const ALCOHOL_OPTIONS: AlcoholOption[] = [
  {
    id: 'ballantines_500',
    title: "Ballantine's",
    volumeLabel: '500 ml',
    price: 149,
  },
  {
    id: 'jameson_500',
    title: 'Jameson',
    volumeLabel: '500 ml',
    price: 169,
  },
  {
    id: 'jack_daniels_500',
    title: "Jack Daniel's",
    volumeLabel: '500 ml',
    price: 199,
  },
  {
    id: 'wyborowa_500',
    title: 'Wódka Wyborowa',
    volumeLabel: '500 ml',
    price: 99,
  },
  {
    id: 'absolut_500',
    title: 'Wódka Absolut',
    volumeLabel: '500 ml',
    price: 119,
  },
]
