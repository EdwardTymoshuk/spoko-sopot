// Header.tsx

'use client'

import { Button } from '@/app/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import NavBar from './NavBar'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isOrderingOpen, setIsOrderingOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isActive, setIsActive] = useState<string>('')
	const router = useRouter()
	const pathName = usePathname()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const response = await fetch('/api/settings')
				const data = await response.json()
				console.log(data)
				setIsOrderingOpen(data.isOrderingOpen)
			} catch (error) {
				console.error('Помилка при завантаженні налаштувань:', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchSettings()
	}, [])

	useEffect(() => {
		if (pathName) {
			setIsActive(pathName)
		} else {
			setIsActive('/')
		}
	}, [pathName])

	return (
		<header className='bg-background p-4 shadow-sm shadow-primary min-h-20 h-auto fixed w-full z-10'>
			<div className='mx-auto flex justify-between items-center'>
				<div className='flex justify-start md:hidden'>
					<FaBars className='text-primary hover:text-primary-foreground text-2xl cursor-pointer transition-all duration-300' onClick={toggleMenu} />
				</div>

				<div className='flex-grow flex justify-center md:justify-start md:flex-1'>
					<Link href='/'>
						<img
							src='img/logo-spoko-2.png'
							alt='Spoko Restaurant Logo'
							className='max-h-12'
						/>
					</Link>
				</div>

				<div className='hidden md:flex md:flex-4'>
					<NavBar className='flex' itemClassName='text-base lg:text-lg text-text-secondary' />
				</div>

				<div className='hidden md:flex md:flex-1 md:gap-2 items-center md:justify-end'>
					<TooltipProvider delayDuration={200}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant='default'
									className={cn(`text-text-primary`, {
										'text-gray-600 opacity-60 hover:bg-primary cursor-not-allowed': !isOrderingOpen,
									})}
								>
									{isOrderingOpen ? (
										'ZAMÓW ONLINE'
									) : (
										<p>
											<span>ZAMÓW ONLINE</span>
											<span className="block text-xs">(tymczasowo niedostępne<i className='text-red-800'>*</i> )</span>
										</p>
									)}
								</Button>
							</TooltipTrigger>
							{!isOrderingOpen && (
								<TooltipContent>
									<p>Usługa zamawiania online jest tymczasowo niedostępna. </p>
									<p>W celu złożenia zamówienia prosimy o kontakt telefoniczny.</p>
								</TooltipContent>
							)}
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{isMenuOpen && (
				<>
					<div
						className='fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden'
						onClick={toggleMenu}
					></div>
					<div className='fixed flex flex-col justify-between inset-0 bg-secondary text-text-primary z-50 p-4 w-3/4 max-w-[400px] min-w-[200px] transform transition-all duration-300 ease-in-out translate-x-0 md:hidden'>
						<div className='flex justify-between items-center'>
							<div>
								<FaTimes className='text-primary hover:text-primary-foreground text-2xl cursor-pointer transition-all duration-300' onClick={toggleMenu} />
							</div>
							<div className='flex'>
								<Link href='/'>
									<img
										src='img/logo-spoko-2.png'
										alt='Spoko Restaurant Logo'
										className='max-h-12'
									/>
								</Link>
							</div>
						</div>
						<NavBar className='mt-8' itemClassName='text-2xl text-text-primary' isColumn toggleMenu={toggleMenu} />
						<div className="mt-8 flex flex-col gap-2">
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											className={cn(
												'w-full text-text-secondary text-wrap text-center',
												{
													'text-gray-600 opacity-60 hover:bg-primary cursor-not-allowed': !isOrderingOpen,
												}
											)}
										>
											{isOrderingOpen ? (
												'ZAMÓW ONLINE'
											) : (
												<p>
													<span>ZAMÓW ONLINE</span>
													<span className="block text-sm">(tymczasowo niedostępne<i className='text-red-800'>*</i> )</span>
												</p>
											)}
										</Button>
									</TooltipTrigger>
									{!isOrderingOpen && (
										<TooltipContent>
											<p>Usługa zamawiania online jest tymczasowo niedostępna. </p>
											<p>W celu złożenia zamówienia prosimy o kontakt telefoniczny.</p>
										</TooltipContent>
									)}
								</Tooltip>
							</TooltipProvider>

							<Button variant="outline" className="w-full">
								ŚLEDŹ ZAMÓWIENIE
							</Button>
						</div>

					</div>
				</>
			)}
		</header>
	)
}

export default Header
