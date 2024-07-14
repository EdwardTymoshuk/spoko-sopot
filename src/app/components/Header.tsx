'use client'

import { Button } from '@/components/ui/button'
import { MENU_ITEMS } from '@/config'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaBars, FaShoppingBasket, FaTimes } from 'react-icons/fa'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isActive, setIsActive] = useState('')
	const router = useRouter()
	const pathName = usePathname()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		setIsActive(pathName)
	}, [pathName])

	return (
		<header className="bg-background p-4 shadow-sm shadow-primary h-auto relative">
			<div className="mx-auto flex justify-between items-center">
				<div className='flex justify-start md:hidden'>
					<FaBars className="text-primary hover:text-primary-foreground text-2xl cursor-pointer transition-all duration-300" onClick={toggleMenu} />
				</div>

				<div className="flex-grow flex justify-center md:justify-start md:flex-1">
					<Link href='/'>
						<img
							src="img/logo-spoko-2.png"
							alt="Spoko Restaurant Logo"
							className="max-h-12"
						/>
					</Link>
				</div>

				<nav className="hidden md:flex md:flex-4">
					<ul className="flex flex-row gap-2 lg:gap-4">
						{MENU_ITEMS.map((item, index) => (
							<li key={index}>
								<Link
									href={item.link}
									className={cn('text-base lg:text-lg text-text-secondary hover:text-primary transition-colors duration-300', {
										'text-primary': isActive === item.link
									})}
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className='flex justify-end md:flex-1 md:gap-2 items-center'>
					<Button className='hidden md:flex md:w-fit lg:text-xs'>ZAMÓWIENIE </Button>
					{/* <Button variant='outline' className='hidden lg:flex md:w-fit md:text-xs'>ŚLEDŹ ZAMÓWIENIE</Button> */}
					<FaShoppingBasket className="text-primary hover:text-primary-foreground text-2xl cursor-pointer transition-all duration-300" />
				</div>
			</div>

			{isMenuOpen && (
				<>
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden"
						onClick={toggleMenu}
					></div>
					<div className="fixed flex flex-col justify-between inset-0 bg-secondary text-text-primary z-50 p-4 w-3/4 max-w-[400px] min-w-[200px] transform transition-all duration-300 ease-in-out translate-x-0 md:hidden">
						<div className="flex justify-between items-center">
							<div>
								<FaTimes className="text-primary hover:text-primary-foreground text-2xl cursor-pointer transition-all duration-300" onClick={toggleMenu} />
							</div>
							<div className='flex'>
								<Link href='/'>
									<img
										src="img/logo-spoko-2.png"
										alt="Spoko Restaurant Logo"
										className="max-h-12"
									/>
								</Link>
							</div>
						</div>
						<nav className="mt-8">
							<ul className="space-y-4">
								{MENU_ITEMS.map((item, index) => (
									<li key={index}>
										<Link
											href={item.link}
											className={cn('text-2xl text-text-primary hover:text-primary transition-colors duration-300', {
												'text-primary': isActive === item.link
											})}
										>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
						<div className="mt-8 flex flex-col gap-2">
							<Button className='w-full text-text-secondary'>ZAMÓW ONLINE</Button>
							<Button variant='outline' className='w-full'>ŚLEDŹ ZAMÓWIENIE</Button>
						</div>
					</div>
				</>
			)}
		</header>
	)
}

export default Header
