import { MenuProvider } from '@/context/MenuContext'
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from 'next'
import { Inter, Lato, Nunito, Roboto } from 'next/font/google'
import { Toaster } from 'sonner'
import Footer from './components/Footer'
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import './globals.css'

require('dotenv').config()
const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({ weight: '400', subsets: ['latin'] })
const lato = Lato({ weight: '400', subsets: ['latin'] })
const nunito = Nunito({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://spokosopot.pl'),
  title: 'Restauracja Spoko | Kuchnia lokalna i europejska w Sopocie',
  description: 'Zapraszamy do Restauracji Spoko w Sopocie. Oferujemy wyjątkowe dania kuchni lokalnej i europejskiej w przyjaznej atmosferze z widokiem na Bałtyk. Sprawdź nasze menu i zarezerwuj stolik już dziś!',
  keywords: [
    'Restauracja Spoko',
    'restauracja Sopot',
    'kuchnia lokalna',
    'kuchnia europejska',
    'widok na Bałtyk',
    'zamówienia online',
    'rezerwacja stolika',
    'opinie',
  ],
  authors: [{ name: 'Restauracja Spoko' }],
  openGraph: {
    title: 'Restauracja Spoko | Kuchnia lokalna i europejska w Sopocie',
    description:
      'Restauracja Spoko w Sopocie to wyjątkowe miejsce na mapie Trójmiasta. Skosztuj dań kuchni lokalnej i europejskiej w unikalnej atmosferze z widokiem na Bałtyk.',
    images: [
      {
        url: '/img/carousel-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Restauracja Spoko',
      },
    ],
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={lato.className}>
        <MenuProvider>
          <ProgressBar />
          <Header />
          {children}
          <Footer />
          <Toaster position='top-center' richColors />
        </MenuProvider>
        <Analytics/> 
      </body>
    </html>
  )
}
