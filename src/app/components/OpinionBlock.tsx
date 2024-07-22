import { FaStar } from "react-icons/fa"
import { Opinion } from '../types'

type OpinionBlockProps = {
	opinion: Opinion
}

const OpinionBlock: React.FC<OpinionBlockProps> = ({ opinion }) => {
	const { author, date, message, rate } = opinion

	const stars = Array.from({ length: 5 }, (_, i) => i < rate ? 'text-primary' : 'text-text-secondary')

	return (
		<div className='bg-transparent border border-primary p-4 m-2 rounded-xl'>
			<div className='flex justify-between'>
				<span className='text-secondary text-xl'>{author}</span>
				<div className='flex flex-row py-2 justify-end'>
					{stars.map((colorClass, i) => (
						<FaStar key={i} className={colorClass} />
					))}
				</div>
			</div>
			<div>
				<span className='italic text-xs'>
					{message}
				</span>
			</div>
			<div className='text-right text-xs text-muted-foreground'>{date}</div>
		</div>
	)
}

export default OpinionBlock
