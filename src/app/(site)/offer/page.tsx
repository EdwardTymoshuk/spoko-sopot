'use client'

import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

/**
 * ReservationLandingPage
 * --------------------------------------------------
 * Editorial-style landing page introducing the reservation wizard.
 * Focused on atmosphere, clarity and premium restaurant experience.
 */
const ReservationLandingPage = () => {
  const router = useRouter()

  return (
    <MainContainer className="pt-20 pb-28">
      {/* HERO */}
      <PageHeaderContainer
        title="Rezerwacja przyjęcia"
        description="Zorganizuj swoje wydarzenie w Restauracji Spoko – w wyjątkowej atmosferze, z dopracowanym menu i profesjonalną obsługą."
        image="/img/offer/reservation-page.webp"
        imageMobile="/img/offer/reservation-page-mobile.webp"
      />

      <MaxWidthWrapper className="space-y-32">
        {/* IMAGE + TEXT */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="hidden md:flex relative aspect-[3/4] rounded-md overflow-hidden">
            <Image
              fill
              src="/img/offer/offer.webp"
              alt="Przyjęcie w restauracji Spoko"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl text-center md:text-start md:text-4xl font-semibold text-secondary">
              Przyjęcia, które mają klimat
            </h2>

            <p className=" text-zinc-400 leading-relaxed">
              Organizacja przyjęcia to coś więcej niż rezerwacja stolika. To
              atmosfera, smak i dbałość o detale, które tworzą wspomnienia.
            </p>

            <p className="text-zinc-400 leading-relaxed">
              Każde wydarzenie planujemy indywidualnie — od układu sali, przez
              sposób podania dań, aż po menu dopasowane do Twoich gości.
            </p>

            {/* subtle trust statement */}
            <p className="text-zinc-400 leading-relaxed">
              Doświadczenie, elastyczne podejście i kuchnia oparta na jakości
              sprawiają, że każde przyjęcie przebiega spokojnie i bez stresu.
            </p>

            <Separator className="hidden md:flex" />

            <div className="relative flex md:hidden aspect-[3/4] rounded-md overflow-hidden">
              <Image
                fill
                src="/img/offer/offer.webp"
                alt="Przyjęcie w restauracji Spoko"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* WHAT YOU CAN ORGANIZE */}
            <h2 className="text-3xl text-center md:text-start md:text-4xl font-semibold text-secondary">
              Co możesz u nas zorganizować
            </h2>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Przyjęcia rodzinne i okolicznościowe
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Urodziny, jubileusze, chrzciny, komunie, zaręczyny czy kameralne
                wesela. Dbamy o elegancką oprawę i swobodną, rodzinną atmosferę.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Spotkania firmowe i kolacje grupowe
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Kolacje biznesowe, integracje zespołów i spotkania po
                konferencjach. Oferujemy menu serwowane lub w formie półmisków.
              </p>
            </div>

            <Separator className="hidden md:flex" />

            <div className="relative flex md:hidden aspect-[3/4] rounded-md overflow-hidden">
              <Image
                fill
                src="/img/offer/offer-2.webp"
                alt="Przyjęcie w restauracji Spoko"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* CTA */}
            <h2 className="text-3xl text-center md:text-start md:text-4xl font-semibold text-secondary">
              Zaplanuj swoje przyjęcie
            </h2>

            <p className="text-zinc-400 leading-relaxed text-center md:text-start">
              Odpowiedz na kilka prostych pytań. Na tej podstawie przygotujemy
              propozycję idealnie dopasowaną do Twojego wydarzenia.
            </p>
            <div className="flex w-full items-center justify-center md:justify-start">
              <Link
                href="/reservation"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="py-6 px-4 text-lg flex items-center w-fit gap-2"
                >
                  Przejdź do planowania
                  <MdOutlineKeyboardArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default ReservationLandingPage
