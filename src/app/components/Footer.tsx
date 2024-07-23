import Link from 'next/link'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import NavBar from './NavBar'

const Footer = () => {
	return (
		<footer className='bg-secondary text-text-primary py-8'>
			<div className='px-8 flex justify-center'>
				<Link href='/'>
					<img
						src='img/logo-spoko-2.png'
						alt='Spoko Restaurant Logo'
						className='max-h-12 w-36 '
					/>
				</Link>
			</div>
			<div className='container mx-auto flex flex-row	 md:flex-row justify-between items-center'>

				<div className='mb-8 md:mb-0'>
					<NavBar className='mt-4' isColumn />
					<div className='mt-4 flex space-x-4 transition-all'>
						<Link href='https://instagram.com' target='_blank' className='text-primary hover:text-white'>
							<FaInstagram size={24} />
						</Link>
						<Link href='https://facebook.com' target='_blank' className='text-primary hover:text-white'>
							<FaFacebook size={24} />
						</Link>
					</div>
				</div>
				<div className='text-center md:text-right'>
					<div className='text-primary mb-4 flex flex-row'>
						<p className='mt-2'>Hestii 3, 81-731 Sopot</p>
					</div>
					<p>Pon-pt: 10:00 - 19:00</p>
					<p>Sob-niedz: 8:00 - 19:00</p>
					<div className='mt-4'>
						<p className='text-primary'>Rezerwacja stolików:</p>
						<p>530-659-666</p>
					</div>
					<div className='mt-4'>
						<p className='text-primary'>Rezerwacja eventów:</p>
						<p>
							<a href='mailto:info@spokosopot.pl' className='underline'>
								info@spokosopot.pl
							</a>
						</p>
					</div>
				</div>
			</div>
			<div className='mt-8 text-center text-gray-400'>
				© 2024 Spoko. All rights reserved.
			</div>
		</footer>
	)
}

export default Footer
