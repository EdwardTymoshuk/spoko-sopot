'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import NavBar from './NavBar'

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isActive, setIsActive] = useState<string>('')
	const router = useRouter()
	const pathName = usePathname()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

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
					<Button className='text-text-secondary'>ZAMÓW ONLINE</Button>
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
						<NavBar className='mt-8' itemClassName='text-2xl text-text-primary' isColumn />
						<div className='mt-8 flex flex-col gap-2'>
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
