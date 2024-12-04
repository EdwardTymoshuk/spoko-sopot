import { MenuProvider } from '@/context/MenuContext'
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
  title: 'Spoko Sopot',
  description: 'Spoko Sopot restauracja',
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
      </body>
    </html>
  )
}
