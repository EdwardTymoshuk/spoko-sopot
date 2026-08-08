'use client'

import Link from 'next/link'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { RestaurantHoursDisplay, useRestaurantContact } from './RestaurantInfo'

const Footer = () => {
	const restaurant = useRestaurantContact()
	return (
		<footer className='bg-secondary text-text-primary py-8'>
			<div className='px-8 flex justify-center'>
				<Link href='/'>
					<span
						aria-hidden='true'
						className='block h-16 w-36 bg-white'
						style={{
							WebkitMask: "url('/img/logo-spoko.svg') center / contain no-repeat",
							mask: "url('/img/logo-spoko.svg') center / contain no-repeat",
						}}
					/>
					<span className='sr-only'>Spoko Sopot</span>
				</Link>
			</div>
			<div className='container mx-auto flex flex-col justify-between items-center gap-4'>
				<div className='text-center flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 w-full md:w-fit md:mx-auto text-lg md:text-base'>
					<div className='flex flex-col'>
						<p className='text-primary'>Godziny otwarcia:</p>
						<RestaurantHoursDisplay compact />
					</div>
					<div className=''>
						<p className='text-primary'>Rezerwacja stolików:</p>
						<p><a href={`tel:${restaurant.phone.replace(/\s/g, '')}`}>{restaurant.phone}</a></p>
					</div>
					<div className=''>
						<p className='text-primary'>Rezerwacja eventów:</p>
						<p><a href={`mailto:${restaurant.email}`} className='underline'>
							{restaurant.email}</a></p>
					</div>
					<div className='flex flex-col items-center'>
						<p className='text-primary'>Lokalizacja:</p>
						<p className='text-text-primary'>{restaurant.address}</p>
					</div>
					<div className=''>
						<p className='text-primary'>Poznaj nas:</p>
						<div className='flex justify-center space-x-4 transition-all'>
							<Link href='https://instagram.com/spokosopot' target='_blank' className='text-text-primary hover:text-primary'>
								<FaInstagram size={24} />
							</Link>
							<Link href='https://facebook.com/spokowsopocie' target='_blank' className='text-text-primary hover:text-primary'>
								<FaFacebook size={24} />
							</Link>
						</div>
					</div>
				</div>
				<div className='flex justify-center items-center gap-8'>
					<span className='text-center text-text-foreground'>© 2026 Spoko Sopot. All rights reserved.</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
