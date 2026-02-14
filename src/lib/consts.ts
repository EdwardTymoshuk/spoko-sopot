//src/lib/consts.ts

import ColdPlateStep from '@/app/components/reservation/steps/ColdPlateStep'
import DateGuestsStep from '@/app/components/reservation/steps/DateGuestsStep'
import PackageStep from '@/app/components/reservation/steps/PackagesStep/PackageStep'
import ServingStep from '@/app/components/reservation/steps/ServingStep'
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
  serving: ServingStep,
  'cold-plate': ColdPlateStep,
}

export const RESERVATION_STEPS = [
  {
    key: 'date-guests',
    label: 'Data i liczba gości',
    isValid: (draft: ReservationDraft) =>
      Boolean(draft.eventDate) &&
      typeof draft.adultsCount === 'number' &&
      draft.adultsCount >= 8 &&
      ((draft.children3to12Count ?? 0) === 0 || Boolean(draft.childrenMenuOption)),
  },
  {
    key: 'package',
    label: 'Pakiet',
    isValid: (draft: ReservationDraft) => {
      if (!draft.packageType) return false

      if (draft.packageType === 'platinum') {
        if (!draft.wantsSoup) return true
        return Boolean(draft.soupChoice)
      }

      return Boolean(draft.soupChoice)
    },
  },
  {
    key: 'serving',
    label: 'Sposób podania',
    isValid: (draft: ReservationDraft) => {
      if (!draft.servingStyle) return false

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
      if (guests < 1) return false

      const minSets = Math.ceil(guests / 6)

      const totalSelected = Object.values(
        draft.coldPlateSelections ?? {}
      ).reduce((sum, val) => sum + val, 0)

      return totalSelected >= minSets
    },
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
        'Roladka z kurczaka nadziewana wędzonym serem, owinięta bekonem, ' +
          'z purée ziemniaczanym z parmezanem, brokułem bimi oraz aromatyczną zieloną oliwą',
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
        'Żeberka wieprzowe',
        'Grillowana karkówka',
        'Roladka z kurczaka z wędzonym serem i suszonymi pomidorami, owinięta boczkiem',
        'Sosy: spicy mayo, salsa mexicana',
        'Ziemniaczki pieczone – 600 g + sos tatarski',
        'Ziemniaki duszone z zasmażką z boczku, cebuli, pieczarek i koperku',
        'Surówki: coleslaw, z marchewki, z buraczków',
      ],

      desserts: ['Sernik', 'Szarlotka', 'Brownie', 'Owoce sezonowe'],

      drinks: ['Woda niegazowana w dzbankach'],
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
        'Set bruschett: z oscypkiem i żurawiną, z karmelizowaną gruszką i gorgonzolą, ' +
          'z prosciutto crudo i pesto bazyliowym',
        'Set mini croissantów: z kurczakiem, sałatą, pomidorkami cherry, ' +
          'cheddarem i sosem tatarskim; z pieczoną szynką, goudą i ogórkiem; ' +
          'z pieczonym burakiem, serem kozim i miodem',
        'Set mini naleśników: z kurczakiem, pieczarkami i serem; z szarpaną łopatką; ' +
          'ze szpinakiem i mozzarellą',
        'Sałatka cesarska z kurczakiem: sałata rzymska, sos cesarski, grillowany kurczak, ' +
          'jajka przepiórcze, pomidorki cherry, grillowany bekon, parmezan, grzanki żytnie',
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
        'Żeberka wieprzowe',
        'Grillowana karkówka',
        'Panierowane polędwiczki z kurczaka',
        'Sosy: spicy mayo, ketchup',
        'Ziemniaczki pieczone + sos tatarski',
        'Ziemniaki duszone z zasmażką z boczku, cebuli, pieczarek i koperku',
        'Surówki: coleslaw, z marchewki, z buraczków',
      ],

      desserts: ['Sernik', 'Szarlotka', 'Brownie', 'Owoce sezonowe'],

      drinks: ['Woda niegazowana w dzbankach'],
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

export const COLD_PLATE_SETS: ColdPlateSet[] = [
  {
    id: 'bruschetta',
    title: '🧀 Set Bruschett',
    price: 199,
    description: [
      'Bruschetta z oscypkiem i żurawiną – 3 szt.',
      'Bruschetta z karmelizowaną gruszką i gorgonzolą – 3 szt.',
      'Bruschetta z prosciutto crudo i pesto – 3 szt.',
    ],
  },
  {
    id: 'tatar',
    title: '🐟 Set Słoików Tatarów',
    price: 249,
    description: [
      'Tatar z łososia – 200 g',
      'Tatar wołowy – 200 g',
      'Tatar ze śledzia – 200 g',
    ],
  },
  {
    id: 'tartaletki',
    title: '🍰 Set Mini Tartaletek',
    price: 179,
    description: [
      'z pastą z łososia – 6 szt.',
      'z pastą z makreli – 6 szt.',
      'z pastą z tuńczyka – 6 szt.',
    ],
  },
  {
    id: 'mini-burgery',
    title: '🍔 Set Mini Burgerów',
    price: 229,
    description: [
      'mini burger z kurczakiem – 6 szt.',
      'mini burger z dorszem – 6 szt.',
    ],
  },
  {
    id: 'krewetki',
    title: '🔥 Krewetki z ogniem',
    price: 269,
    description: [
      'krewetki smażone w sosie autorskim – 8 szt.',
      'grillowane grzanki w zestawie',
    ],
  },
  {
    id: 'mini-nalesniki',
    title: '🥞 Set Mini Naleśników',
    price: 219,
    description: [
      'z kurczakiem, pieczarkami i serem – 3 szt.',
      'z szarpaną łopatką – 3 szt.',
      'ze szpinakiem i mozzarellą – 3 szt.',
    ],
  },
  {
    id: 'mini-croissanty',
    title: '🥐 Set Mini Croissantów',
    price: 229,
    description: [
      'z kurczakiem, sałatą, pomidorkami cherry i sosem tatarskim – 3 szt.',
      'z pieczoną szynką, serem gouda i świeżym ogórkiem – 3 szt.',
      'z pieczonym burakiem, serem kozim i miodem – 3 szt.',
    ],
  },
  {
    id: 'szaszlyki-krewetki',
    title: '🍤 Szaszłyki z krewetkami i ananasem',
    price: 279,
    description: [
      '1 porcja = 1 szaszłyk (2 grillowane krewetki + 3 kawałki świeżego ananasa)',
      '1 półmisek = 12 szaszłyków',
    ],
  },
  {
    id: 'dary-morza',
    title: '🌊 Set „Dary Morza” – półmisek',
    price: 299,
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
    price: 249,
    description: [
      'delikatnie opiekany tuńczyk, podawany na zimno',
      'sos sezamowo-sojowy',
    ],
  },
  {
    id: 'tartaletki-kawiorem',
    title: '🥟 Tartaletki z kawiorem',
    price: 289,
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
