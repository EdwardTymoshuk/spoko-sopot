// /app/menu/page.tsx

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion'
import { MenuItemCategory, MenuItemType } from '@/app/types'
import { fetchMenuItems } from '@/lib/menu'
import MainContainer from '../components/MainContainer'
import MenuItem from '../components/MenuItem'
import PageHeaderContainer from '../components/PageHeaderComponent'

const categoryOrder: Record<string, number> = {
	'Śniadania': 1,
	'Przystawki': 2,
	'Zupy': 3,
	'Makarony/Ravioli': 4,
	'Burgery': 5,
	'Dania mięsne': 6,
	'Dania rybne': 7,
	'Owoce morza': 8,
	'Bowle': 9,
	'Dla dzieci': 10,
	'Desery': 11,
	'Dodatki': 12,
	'Wina Czerwone': 13,
	'Wina Białe': 14,
	'Wina Musujące': 15,
	'Wina Różowe': 16,
	'Napoje bezalkoholowe': 17,
	'Inne': Infinity,
}

// Унікальні категорії з елементів меню
const getUniqueCategories = (items: MenuItemType[]): MenuItemCategory[] => {
	const categories = items.map(item => item.category)
	return Array.from(new Set(categories)) as MenuItemCategory[]
}

const sortCategories = (categories: MenuItemCategory[]): MenuItemCategory[] => {
	return categories.sort((a, b) => {
		const orderA = categoryOrder[a] || Infinity // Default for undefined categories
		const orderB = categoryOrder[b] || Infinity
		return orderA - orderB
	})
}

const MenuPage = async () => {
	// Отримуємо меню
	const menuItems: MenuItemType[] = await fetchMenuItems()
	const categoriesData: MenuItemCategory[] = getUniqueCategories(menuItems)
	const categories = sortCategories(categoriesData)

	return (
		<MainContainer className='pt-20'>
			<MaxWidthWrapper>
				<PageHeaderContainer
					description='Zapraszamy do odkrycia wyjątkowych smaków, które przygotowaliśmy specjalnie dla Was. Nasze menu to starannie skomponowana oferta, która łączy w sobie tradycję z nowoczesnością, wykorzystując najlepsze składniki sezonowe. Smacznego!'
					title='Menu'
					image='/img/menu-page.jpg'
					imageMobile='/img/menu-page-mobile.jpg'
				/>

				<Accordion type="single" collapsible className=''>
					{categories.map((category, index) => (
						<AccordionItem key={category} value={`item-${index}`} className='border-0'>
							<AccordionTrigger className='text-text-foreground hover:text-text-secondary data-[state=open]:text-text-secondary text-4xl md:text-5xl hover:no-underline'>
								{category}
							</AccordionTrigger>
							<AccordionContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
								{menuItems
									.filter(item => item.category === category)
									.map(item => (
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
			</MaxWidthWrapper>
		</MainContainer>
	)
}

export default MenuPage