'use client'

import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import Image from 'next/image'
import { FiCalendar, FiMail, FiPhoneCall } from 'react-icons/fi'

const ReservationLandingPage = () => {
  return (
    <MainContainer className="pt-14 pb-24">
      <PageHeaderContainer
        title="Rezerwacja przyjęcia"
        description="Zorganizuj rodzinne przyjęcie, kolację grupową albo spotkanie firmowe w Spoko. Przygotujemy menu, obsługę i układ dopasowany do charakteru wydarzenia."
        image="/img/offer/reservation-page.webp"
        imageMobile="/img/offer/reservation-page-mobile.webp"
      />

      <MaxWidthWrapper className="space-y-20 py-12 md:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm sm:aspect-[16/10] lg:aspect-[4/5]">
            <Image
              fill
              src="/img/offer/offer.webp"
              alt="Przyjęcie w restauracji Spoko"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Przyjęcia i eventy
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-secondary md:text-5xl">
              Spotkania przy stole, dopracowane od menu po obsługę
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Organizacja przyjęcia to coś więcej niż rezerwacja stolika. To
              atmosfera, smak i dbałość o detale, które sprawiają, że goście
              czują się swobodnie od pierwszego powitania.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Każde wydarzenie planujemy indywidualnie: od układu sali, przez
              sposób podania dań, aż po menu dopasowane do charakteru spotkania.
            </p>

            <div className="mt-8 grid gap-6 border-y border-[#ded8cc] py-6 sm:grid-cols-3">
              {[
                ['Menu', 'Serwowane, półmiski lub forma dopasowana do spotkania.'],
                ['Obsługa', 'Sprawny rytm wydarzenia i opieka nad gośćmi.'],
                [
                  'Miejsce',
                  'Restauracja przy plaży, z tarasem i widokiem na morze.',
                ],
              ].map(([title, description]) => (
                <div key={title}>
                  <div className="mb-3 h-1 w-10 rounded-full bg-primary" />
                  <p className="font-semibold text-secondary">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex w-full justify-center">
          <Separator className="my-0 w-40 bg-[#ded8cc] sm:w-72 md:w-full md:max-w-4xl" />
        </div>

        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Możliwości
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
                Co możesz u nas zorganizować
              </h2>
            </div>

            <div className="space-y-3 border-t border-[#ded8cc] pt-6">
              <h3 className="font-serif text-2xl text-zinc-950">
                Przyjęcia rodzinne i okolicznościowe
              </h3>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-500">
                Urodziny, jubileusze, chrzciny, komunie, zaręczyny czy
                kameralne wesela. Dbamy o elegancką oprawę i swobodną,
                rodzinną atmosferę.
              </p>
            </div>

            <div className="space-y-3 border-t border-[#ded8cc] pt-6">
              <h3 className="font-serif text-2xl text-zinc-950">
                Spotkania firmowe i kolacje grupowe
              </h3>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-500">
                Kolacje biznesowe, integracje zespołów i spotkania po
                konferencjach. Przygotujemy menu serwowane lub w formie
                półmisków.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm sm:aspect-[16/10] lg:aspect-[4/5]">
            <Image
              fill
              src="/img/offer/offer-2.webp"
              alt="Nakryty stół na przyjęcie w Spoko"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <div className="flex w-full justify-center">
          <Separator className="my-0 w-40 bg-[#ded8cc] sm:w-72 md:w-full md:max-w-4xl" />
        </div>

        <section className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Rezerwacja online
          </p>

          <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
            Zaplanuj swoje przyjęcie
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
            Opowiedz nam o planowanym wydarzeniu, a przygotujemy propozycję
            dopasowaną do liczby gości, charakteru spotkania i oczekiwanej
            formy serwisu.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="h-12 gap-2.5 rounded-lg bg-secondary px-6 font-semibold text-white shadow-none hover:bg-secondary/90"
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

          <div className="mx-auto mt-8 flex w-full max-w-sm items-center gap-4 text-xs uppercase tracking-[0.18em] text-zinc-400">
            <Separator className="flex-1 bg-[#ded8cc]" />
            <span>kontakt bezpośredni</span>
            <Separator className="flex-1 bg-[#ded8cc]" />
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 text-sm font-medium text-zinc-500 sm:flex-row sm:justify-center sm:gap-6">
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
        </section>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default ReservationLandingPage
