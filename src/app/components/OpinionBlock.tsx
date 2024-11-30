import { FaStar } from "react-icons/fa"
import { MongoDBReview } from '../types'

type OpinionBlockProps = {
	opinion: MongoDBReview
}

const OpinionBlock: React.FC<OpinionBlockProps> = ({ opinion }) => {
	const { author, date, message, rating } = opinion

	const stars = Array.from({ length: 5 }, (_, i) => (
		<FaStar key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'} />
	))

	return (
		<div className='bg-white border border-gray-200 shadow-md p-4 m-2 rounded-xl'>
			<div className='flex justify-between items-center'>
				<span className='font-bold text-lg text-primary'>{author}</span>
				<div className='flex'>{stars}</div>
			</div>
			<div className='mt-2 text-sm text-gray-700 italic'>
				{message}
			</div>
			<div className='mt-4 text-right text-xs text-gray-500'>{date}</div>
		</div>
	)
}

export default OpinionBlock
