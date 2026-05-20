'use client'

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import MainContainer from '@/app/components/MainContainer'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { MenuDownloadDocument, MenuItemType } from '@/app/types'
import {
  drinkMenuItemCategories,
  foodMenuItemCategories,
  getMenuCategorySortIndex,
} from '@/config'
import { Download, ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface PublicMenuCategory {
  name: string
  items: MenuItemType[]
}

interface PublicMenuSection {
  title: string
  categories: PublicMenuCategory[]
}

const priceFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  maximumFractionDigits: 0,
})

const groupItemsByCategory = (
  items: MenuItemType[],
  categories: readonly string[]
): PublicMenuCategory[] =>
  categories
    .map((category) => ({
      name: category,
      items: items
        .filter((item) => item.category === category)
        .sort((a, b) => a.name.localeCompare(b.name, 'pl')),
    }))
    .filter((category) => category.items.length > 0)

const buildMenuSections = (items: MenuItemType[]): PublicMenuSection[] => {
  const normalizedItems = [...items].sort((a, b) => {
    const categoryDiff =
      getMenuCategorySortIndex(a.category) - getMenuCategorySortIndex(b.category)

    if (categoryDiff !== 0) return categoryDiff
    return a.name.localeCompare(b.name, 'pl')
  })

  const knownCategories = new Set([
    ...foodMenuItemCategories,
    ...drinkMenuItemCategories,
  ])
  const otherCategories = Array.from(
    new Set(
      normalizedItems
        .map((item) => item.category)
        .filter((category) => !knownCategories.has(category))
    )
  )

  return [
    {
      title: 'Dania',
      categories: groupItemsByCategory(normalizedItems, foodMenuItemCategories),
    },
    {
      title: 'Napoje',
      categories: groupItemsByCategory(normalizedItems, drinkMenuItemCategories),
    },
    {
      title: 'Pozostałe',
      categories: groupItemsByCategory(normalizedItems, otherCategories),
    },
  ].filter((section) => section.categories.length > 0)
}

const MenuDocumentCard = ({ document }: { document: MenuDownloadDocument }) => (
  <article className="flex flex-wrap items-center gap-x-5 gap-y-1">
    <span className="font-serif text-lg leading-tight text-primary">
      {document.title}
    </span>

    <div className="flex items-center gap-2.5">
      <a
        href={document.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-primary"
      >
        <ExternalLink className="size-3" />
        Podgląd
      </a>
      <a
        href={document.url}
        download={document.fileName}
        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-800 transition hover:text-primary"
      >
        <Download className="size-3" />
        Pobierz
      </a>
    </div>
  </article>
)

const MenuSkeleton = () => (
  <div className="space-y-12">
    <section className="space-y-10">
      <div className="mx-auto h-14 w-40 animate-pulse rounded-sm bg-zinc-200/80" />
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-2">
        {[0, 1].map((column) => (
          <div key={column} className="border-t border-zinc-300/80 pt-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-8 w-36 animate-pulse rounded-sm bg-zinc-200/80" />
              <div className="h-px flex-1 bg-zinc-300/80" />
            </div>
            <div className="space-y-7">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-44 animate-pulse rounded-sm bg-zinc-200/80" />
                    <div className="h-px flex-1 border-b border-dotted border-zinc-300/80" />
                    <div className="h-4 w-10 animate-pulse rounded-sm bg-zinc-200/80" />
                  </div>
                  <div className="h-4 w-3/4 animate-pulse rounded-sm bg-zinc-200/70" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
)

const MenuItemRow = ({ item }: { item: MenuItemType }) => (
  <li className="py-4">
    <div className="flex items-start gap-4">
      {item.image ? (
        <span
          aria-hidden="true"
          className="mt-1 size-16 shrink-0 rounded-md bg-cover bg-center shadow-sm"
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h4 className="font-serif text-[1.05rem] leading-snug text-zinc-950">
            {item.name}
          </h4>
          <span className="hidden min-w-8 flex-1 border-b border-dotted border-zinc-300/80 sm:block" />
          <p className="shrink-0 text-sm font-semibold text-zinc-900">
            {priceFormatter.format(item.price)}
          </p>
        </div>
        {item.description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
            {item.description}
          </p>
        ) : null}
      </div>
    </div>
  </li>
)

const MenuSection = ({ section }: { section: PublicMenuSection }) => (
  <section className="space-y-10">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="mt-3 font-serif text-5xl text-zinc-950 md:text-6xl">
        {section.title}
      </h2>
    </div>

    <div className="grid gap-x-14 gap-y-12 lg:grid-cols-2">
      {section.categories.map((category) => (
        <article
          key={category.name}
          className="border-t border-zinc-300/80 pt-6"
        >
          <div className="mb-2 flex items-center gap-4">
            <h3 className="font-serif text-3xl text-zinc-950">
              {category.name}
            </h3>
            <span className="h-px flex-1 bg-zinc-300/80" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
              {category.items.length}
            </span>
          </div>
          <ul className="divide-y divide-zinc-200/70">
            {category.items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
)

const MenuPage = () => {
  const [menuDocuments, setMenuDocuments] = useState<MenuDownloadDocument[]>([])
  const [items, setItems] = useState<MenuItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadMenu = async () => {
      try {
        const [itemsResponse, documentsResponse] = await Promise.all([
          fetch(`/api/menu?timestamp=${Date.now()}`, { cache: 'no-store' }),
          fetch(`/api/menu-documents?timestamp=${Date.now()}`, {
            cache: 'no-store',
          }),
        ])

        const [nextItems, nextDocuments] = await Promise.all([
          itemsResponse.ok ? itemsResponse.json() : Promise.resolve([]),
          documentsResponse.ok ? documentsResponse.json() : Promise.resolve([]),
        ])

        if (!isMounted) return

        setItems(Array.isArray(nextItems) ? nextItems : [])
        setMenuDocuments(Array.isArray(nextDocuments) ? nextDocuments : [])
      } catch (error) {
        console.error('Error fetching public menu:', error)
        if (isMounted) {
          setItems([])
          setMenuDocuments([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadMenu()

    return () => {
      isMounted = false
    }
  }, [])

  const sections = useMemo(() => buildMenuSections(items), [items])

  return (
    <MainContainer className="pt-20 bg-[#f5f1ea] pb-8">
      <PageHeaderContainer
        description="Zapraszamy do odkrycia wyjątkowych smaków, które przygotowaliśmy specjalnie dla Was. Nasze menu to starannie skomponowana oferta, która łączy w sobie tradycję z nowoczesnością, wykorzystując najlepsze składniki sezonowe. Smacznego!"
        title="Menu"
        image="/img/menu-page.jpg"
        imageMobile="/img/menu-page-mobile.jpg"
      />

      <MaxWidthWrapper className="space-y-14">
        {menuDocuments.length > 0 ? (
          <section className="-mt-3 border-y border-zinc-300/80 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-zinc-500">
                Wolisz przejrzeć klasyczną kartę? Dostępna jest także wersja
                PDF.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {menuDocuments.map((document) => (
                  <MenuDocumentCard key={document.id} document={document} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {sections.length > 0 ? (
          <div className="space-y-20">
            {sections.map((section) => (
              <MenuSection key={section.title} section={section} />
            ))}
          </div>
        ) : isLoading ? (
          <MenuSkeleton />
        ) : (
          <section className="rounded-md border border-zinc-200 bg-white p-10 text-center shadow-sm">
            <h2 className="font-serif text-3xl text-zinc-950">
              Menu będzie dostępne wkrótce
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Aktualizujemy listę dań. W sprawie bieżącej oferty prosimy o
              kontakt z obsługą restauracji.
            </p>
          </section>
        )}

        <footer className="px-4 pb-12">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-zinc-400">
            *Menu prezentowane na stronie ma charakter orientacyjny i może ulec
            zmianie. Aktualne ceny oraz dostępność dań mogą różnić się od tych
            przedstawionych online. W celu potwierdzenia szczegółów prosimy o
            kontakt z obsługą na miejscu lub wysłanie zapytania na adres:&nbsp;
            <a
              href="mailto:info@spokosopot.pl"
              className="text-amber-600 hover:underline"
            >
              info@spokosopot.pl
            </a>
            .
          </p>
        </footer>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default MenuPage
