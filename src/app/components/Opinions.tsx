'use client'

import { OPINIONS } from '@/config'
import { startTransition, useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { MongoDBReview } from '../types'
import LoadingButton from './LoadingButton'
import MaxWidthWrapper from './MaxWidthWrapper'
import OpinionBlock from './OpinionBlock'
import PageContainer from './PageContainer'
import PageSubHeader from './PageSubHeader'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'

const Opinions: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [reviews, setReviews] = useState<MongoDBReview[]>(OPINIONS)


	const formatReview = (review: MongoDBReview) => ({
		_id: review._id,
		author: review.author,
		message: review.message,
		rating: review.rating,
		date: review.date
	})

	const navigateToGoogleReviews = () => {
		setIsLoading(true)
		startTransition(() => {
			window.open(
				"https://www.google.com/maps/place/Restauracja+Spoko+Sopot/@54.4326013,18.5841072,17z/data=!4m8!3m7!1s0x46fd0b6edee7521f:0x324a244fefc976ef!8m2!3d54.4326013!4d18.5866821!9m1!1b1!16s%2Fg%2F11g0j6ltv2?entry=ttu&g_ep=EgoyMDI0MTIwNC4wIKXMDSoASAFQAw%3D%3D",
				"_blank",
				"noopener,noreferrer"
			)
		})

		setIsLoading(false)
	}


	return (
		<MaxWidthWrapper>
			<PageSubHeader title="Nasi goście o nas" />

			<Carousel className="w-full h-full">
				<CarouselContent className="relative h-full m-0">
					{reviews.map((review, index) => (
						<CarouselItem key={index} className="relative h-full p-4 self-center">
							<OpinionBlock opinion={formatReview(review)} />
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselNext />
				<CarouselPrevious />
			</Carousel>

			<PageContainer className='pt-2 pb-8'>
				<LoadingButton
					isLoading={isLoading}
					onClick={navigateToGoogleReviews}
					variant="default"
				>
					Zobacz więcej <MdOutlineKeyboardArrowRight />
				</LoadingButton>
			</PageContainer>
		</MaxWidthWrapper>
	)
}

export default Opinions
