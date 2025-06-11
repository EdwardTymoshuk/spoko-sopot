'use client'

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion'
import { Skeleton } from '@/app/components/ui/skeleton'
import { MenuItemCategory, MenuItemType } from '@/app/types'
import { allowedCategories } from '@/config'
import { useEffect, useState } from 'react'
import MainContainer from '../components/MainContainer'
import MenuItem from '../components/MenuItem'
import PageHeaderContainer from '../components/PageHeaderComponent'

const categoryOrder: Record<string, number> = {
  Śniadania: 1,
  Przystawki: 2,
  Zupy: 3,
  'Makarony/Ravioli': 4,
  Burgery: 5,
  'Dania mięsne': 6,
  'Dania rybne': 7,
  'Owoce morza': 8,
  Bowle: 9,
  'Dla dzieci': 10,
  Desery: 11,
  Dodatki: 12,
  'Wina Czerwone': 13,
  'Wina Białe': 14,
  'Wina Musujące': 15,
  'Wina Różowe': 16,
  'Napoje bezalkoholowe': 17,
  Inne: Infinity,
}

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu', { cache: 'no-store' })
        const data = await response.json()
        setMenuItems(
          data.filter(
            (item: MenuItemType) =>
              item.isActive && allowedCategories.includes(item.category)
          )
        )
      } catch (error) {
        console.error('Error fetching menu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const excludedCategories = ['Pizza']

  const getUniqueCategories = (items: MenuItemType[]): MenuItemCategory[] => {
    const categories = items.map((item) => item.category)
    return Array.from(new Set(categories)).filter(
      (category) => !excludedCategories.includes(category)
    ) as MenuItemCategory[]
  }

  const sortCategories = (
    categories: MenuItemCategory[]
  ): MenuItemCategory[] => {
    return categories.sort((a, b) => {
      const orderA = categoryOrder[a] || Infinity
      const orderB = categoryOrder[b] || Infinity
      return orderA - orderB
    })
  }

  const categoriesData: MenuItemCategory[] = getUniqueCategories(menuItems)
  const categories = sortCategories(categoriesData)

  return (
    <MainContainer className="pt-20">
      <MaxWidthWrapper>
        <PageHeaderContainer
          description="Zapraszamy do odkrycia wyjątkowych smaków, które przygotowaliśmy specjalnie dla Was. Nasze menu to starannie skomponowana oferta, która łączy w sobie tradycję z nowoczesnością, wykorzystując najlepsze składniki sezonowe. Smacznego!"
          title="Menu"
          image="/img/menu-page.jpg"
          imageMobile="/img/menu-page-mobile.jpg"
        />

        {loading ? (
          <div className="space-y-10">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-center space-y-6"
              >
                <Skeleton className="h-10 w-full sm:w-full md:w-1/2 lg:w-1/4 mx-auto" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-4 md:px-0">
                  {[...Array(3)].map((_, itemIndex) => (
                    <Skeleton
                      key={itemIndex}
                      className="h-[200px] w-full rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="">
            {categories.map((category, index) => (
              <AccordionItem
                key={category}
                value={`item-${index}`}
                className="border-0"
              >
                <AccordionTrigger className="text-text-foreground hover:text-text-secondary data-[state=open]:text-text-secondary text-4xl md:text-5xl hover:no-underline">
                  {category}
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <MenuItem
                        key={item.name}
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        image={item.image}
                        orientation="horizontal"
                      />
                    ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default MenuPage
