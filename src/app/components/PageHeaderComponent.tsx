import PageContainer from './PageContainer'
import { Separator } from './ui/separator'

const PageHeaderContainer = ({ title, description, image, imageMobile }: { title: string, description: string, image: string, imageMobile?: string }) => {
	return (
		<PageContainer>
			<h2 className='text-6xl text-center font-semibold text-text-secondary py-4 px-2 self-center mx-2'>
				{title}
			</h2>
			<Separator className='mb-8 mx-auto w-1/2 bg-primary' />
			<picture className="relative w-full h-96 mb-8 rounded-lg">
				<source srcSet={imageMobile} media="(max-width: 768px)" />
				<img
					src={image}
					alt="Responsive image"
					className='w-full h-full object-cover rounded-lg'
				/>
			</picture>

			<span className='flex mx-auto text-base md:text-lg lg:text-xl text-justify text-text-seconadry'>
				{description}
			</span>
			<Separator className='my-8 mx-auto w-1/2 bg-primary' />
		</PageContainer>
	)
}

export default PageHeaderContainer