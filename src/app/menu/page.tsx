// /app/menu/page.tsx

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion'
import { MenuItemCategory, MenuItemType } from '@/app/types'
import { fetchMenuItems } from '@/lib/menu'
import MainContainer from '../components/MainContainer'
import MenuItem from '../components/MenuItem'
import PageHeaderContainer from '../components/PageHeaderComponent'

// Унікальні категорії з елементів меню
const getUniqueCategories = (items: MenuItemType[]): MenuItemCategory[] => {
	const categories = items.map(item => item.category)
	return Array.from(new Set(categories)) as MenuItemCategory[]
}

export default async function MenuPage() {
	// Отримуємо меню
	const menuItems: MenuItemType[] = await fetchMenuItems()
	const categories: MenuItemCategory[] = getUniqueCategories(menuItems)

	return (
		<MainContainer className='pt-20'>
			<MaxWidthWrapper>
				<PageHeaderContainer
					description=' Zapraszamy do odkrycia wyjątkowych smaków, które przygotowaliśmy specjalnie dla Was. Nasze menu to starannie skomponowana oferta, która łączy w sobie tradycję z nowoczesnością, wykorzystując najlepsze składniki sezonowe.
          Chcemy, aby każda wizyta w naszej restauracji była niezapomnianym doświadczeniem kulinarnym. Serdecznie zapraszamy do zapoznania się z naszym menu i życzymy smacznego!'
					title='Menu'
					image='/img/menu-page.jpg'
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