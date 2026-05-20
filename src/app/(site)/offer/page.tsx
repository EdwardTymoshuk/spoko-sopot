'use client'

import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import Image from 'next/image'
import { FiCalendar, FiMail, FiPhoneCall } from 'react-icons/fi'

/**
 * ReservationLandingPage
 * --------------------------------------------------
 * Editorial-style landing page introducing the reservation wizard.
 * Focused on atmosphere, clarity and premium restaurant experience.
 */
const ReservationLandingPage = () => {
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

            <div className="mx-auto w-full max-w-xl space-y-5 py-4 text-center md:mx-0 md:text-start">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Rezerwacja online
              </p>

              <h2 className="text-3xl font-semibold text-secondary md:text-4xl">
                Zaplanuj swoje przyjęcie
              </h2>

              <p className="text-zinc-400 leading-relaxed">
                Opowiedz nam o planowanym wydarzeniu, a przygotujemy propozycję
                dopasowaną do liczby gości, charakteru spotkania i oczekiwanej
                formy serwisu.
              </p>

              <div className="flex justify-center md:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-12 gap-2 rounded-lg bg-secondary px-6 font-semibold text-white shadow-none hover:bg-secondary/90"
                >
                  <a
                    href="https://spokosopot.pl/reservation"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiCalendar className="h-4 w-4" />
                    Przejdź do formularza
                  </a>
                </Button>
              </div>

              <div className="mx-auto flex w-full max-w-sm items-center gap-4 text-xs uppercase tracking-[0.18em] text-zinc-400 md:mx-0">
                <Separator className="flex-1" />
                <span>kontakt bezpośredni</span>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col items-center gap-3 text-sm font-medium text-zinc-500 sm:flex-row sm:justify-center sm:gap-6 md:justify-start">
                <a
                  href="tel:+48530659666"
                  className="inline-flex items-center gap-2 transition-colors hover:text-secondary"
                >
                  <FiPhoneCall className="h-4 w-4 text-primary" />
                  530 659 666
                </a>

                <a
                  href="mailto:info@spokosopot.pl"
                  className="inline-flex items-center gap-2 transition-colors hover:text-secondary"
                >
                  <FiMail className="h-4 w-4 text-primary" />
                  info@spokosopot.pl
                </a>
              </div>
            </div>
          </div>
        </section>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default ReservationLandingPage
