import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import { MenuItemType } from '@/app/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { MENU_ITEMS } from '@/config'
import MainContainer from '../components/MainContainer'
import MenuItem from '../components/MenuItem2'
import PageDescription from '../components/PageDescription'
import PageHeader from '../components/PageHeader'

const getUniqueCategories = (items: MenuItemType[]): string[] => {
	const categories = items.map(item => item.category)
	return Array.from(new Set(categories))
}

const MenuPage = () => {
	const categories = getUniqueCategories(MENU_ITEMS)

	return (
		<MainContainer className='pt-20'>
			<MaxWidthWrapper>
				<PageHeader title='Menu' />
				<Separator className='mb-8 mx-auto w-1/2 bg-primary' />
				<PageDescription content='
          Zapraszamy do odkrycia wyjątkowych smaków, które przygotowaliśmy specjalnie dla Was. Nasze menu to starannie skomponowana oferta, która łączy w sobie tradycję z nowoczesnością, wykorzystując najlepsze składniki sezonowe.
          Chcemy, aby każda wizyta w naszej restauracji była niezapomnianym doświadczeniem kulinarnym. Serdecznie zapraszamy do zapoznania się z naszym menu i życzymy smacznego!
        '/>
				<Separator className='my-8 mx-auto w-1/2 bg-primary' />

				<Accordion type="single" collapsible className=''>
					{categories.map((category, index) => (
						<AccordionItem key={category} value={`item-${index}`} className='border-0'>
							<AccordionTrigger className='text-text-foreground hover:text-text-secondary data-[state=open]:text-text-secondary text-4xl md:text-5xl hover:no-underline'>
								{category}
							</AccordionTrigger>
							<AccordionContent className='flex flex-wrap mx-auto justify-around sm-plus:justify-around md:justify-between gap-4'>
								{MENU_ITEMS.filter(item => item.category === category).map(item => (
									<MenuItem
										key={item.name}
										name={item.name}
										price={item.price}
										description={item.description}
										image={item.image}
										orientation='horizontal'
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