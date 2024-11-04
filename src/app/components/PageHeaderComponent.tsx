import Image from 'next/image'
import PageContainer from './PageContainer'
import { Separator } from './ui/separator'

const PageHeaderContainer = ({ title, description, image }: { title: string, description: string, image: string }) => {
	return (
		<PageContainer>
			<h2 className='text-6xl text-center font-semibold text-text-secondary py-4 px-2 self-center mx-2'>
				{title}
			</h2>
			<Separator className='mb-8 mx-auto w-1/2 bg-primary' />
			<div className='relative w-full h-96 mb-8'>
				<Image
					src={image}
					alt={`${title} image header`}
					fill
					className='object-cover rounded-lg'
				/>
			</div>

			<span className='flex mx-auto text-base md:text-lg lg:text-xl text-justify text-text-seconadry'>
				{description}
			</span>
			<Separator className='my-8 mx-auto w-1/2 bg-primary' />
		</PageContainer>
	)
}

export default PageHeaderContainer