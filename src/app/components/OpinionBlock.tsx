import { FaStar } from 'react-icons/fa'
import { MongoDBReview } from '../types'

type OpinionBlockProps = {
  opinion: MongoDBReview
}

const OpinionBlock: React.FC<OpinionBlockProps> = ({ opinion }) => {
  const { author, date, message, rating } = opinion

  const stars = Array.from({ length: 5 }, (_, i) => (
    <FaStar
      key={i}
      className={i < rating ? 'text-primary' : 'text-zinc-200'}
    />
  ))

  return (
    <article className="min-h-[220px] rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-secondary">{author}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
            {date}
          </p>
        </div>
        <div className="flex gap-1">{stars}</div>
      </div>

      <p className="mt-5 line-clamp-5 text-sm leading-relaxed text-zinc-600">
        {message}
      </p>
    </article>
  )
}

export default OpinionBlock
