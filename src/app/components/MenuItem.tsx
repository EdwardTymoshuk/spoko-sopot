import { MenuItem as MenuItemType } from '@/app/types'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from "@/components/ui/card"
import Image from 'next/image'

const MenuItem: React.FC<Partial<MenuItemType>> = ({ name, price, description, image }) => {
	return (
		<Card className='w-full max-w-sm border-0 shadow-none flex flex-col justify-between'>
			<CardHeader className='p-0'>
				<div className='relative w-full h-48'>
					{image ? (
						<Image
							src={image}
							alt={name ?? 'Menu item image'}
							layout='fill'
							objectFit='cover'
							className='rounded-md'
						/>
					) : (
						<div className='w-full h-full bg-gray-200 rounded-md flex items-center justify-center italic text-text-foreground'>
							No image available
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className='p-2 border-0 flex-grow'>
				<h4 className='uppercase text-lg text-secondary py-2 font-bold'>{name}</h4>
				<span className='text-sm text-text-foreground italic'>{description}</span>
			</CardContent>
			<CardFooter className='px-2 pb-2 mt-auto'>
				<span className='text-secondary'>{price} zł</span>
			</CardFooter>
		</Card>
	)
}

export default MenuItem
