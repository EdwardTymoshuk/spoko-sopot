import { OPINIONS } from '@/config'
import { useState } from 'react'
import { MongoDBReview } from '../types'
import MaxWidthWrapper from './MaxWidthWrapper'
import OpinionBlock from './OpinionBlock'
import PageSubHeader from './PageSubHeader'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'

const Opinions: React.FC = () => {
	const [reviews, setReviews] = useState<MongoDBReview[]>(OPINIONS)


	const formatReview = (review: MongoDBReview) => ({
		_id: review._id,
		author: review.author,
		message: review.message,
		rating: review.rating,
		date: review.date
	})

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
		</MaxWidthWrapper>
	)
}

export default Opinions
