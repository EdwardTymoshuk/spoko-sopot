import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

const MainContainer = ({
	className,
	children
}: {
	className?: string,
	children: ReactNode
}) => {
	return (
		<main className={cn('flex min-h-screen flex-col items-center max-w-full overflow-x-hidden', className)} >
			{children}
		</main>
	)
}

export default MainContainer
