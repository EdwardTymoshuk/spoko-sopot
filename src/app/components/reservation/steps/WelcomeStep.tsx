'use client'

import { Button } from '@/app/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { HiArrowRight } from 'react-icons/hi2'

/**
 * WelcomeStep
 * --------------------------------------------------
 * Editorial welcome screen for the reservation wizard.
 * Premium, calm, hospitality-first onboarding.
 */
const WelcomeStep = () => {
  const router = useRouter()

  return (
    <div className="flex w-full flex-col bg-background md:h-full md:flex-row md:overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-[30svh] min-h-[190px] shrink-0 sm:h-[36svh] md:h-auto md:w-1/2">
        <Image
          fill
          src="/img/offer/reservation-welcome.webp"
          alt="Eleganckie wnętrze restauracji Spoko"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10 md:hidden" />
      </div>

      {/* CONTENT */}
      <div className="relative flex w-full items-start px-5 pb-6 sm:px-8 md:w-1/2 md:items-center md:px-14 md:pb-0 lg:px-20">
        {/* Card */}
        <div className="relative -mt-8 w-full max-w-lg space-y-4 rounded-xl bg-white p-5 shadow-sm sm:-mt-10 sm:space-y-6 sm:p-7 md:mt-0 md:space-y-8 md:rounded-none md:bg-transparent md:p-0 md:shadow-none">
          {/* Heading */}
          <h1 className="font-serif text-2xl leading-tight sm:text-4xl md:text-5xl">
            Zaplanujmy Twoje wydarzenie krok po kroku
          </h1>

          {/* Body */}
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:space-y-4 sm:text-base md:space-y-5 md:text-lg">
            <p>
              Wypełnij krótki formularz, a przygotujemy propozycję przyjęcia
              dopasowaną do liczby gości i charakteru wydarzenia.
            </p>

            <ul className="space-y-1.5">
              <li>• wybierzesz datę i liczbę gości,</li>
              <li>• dobierzesz pakiet i sposób podania dań,</li>
              <li>• od razu zobaczysz orientacyjną sumę.</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-1 md:pt-4">
            <Button
              size="lg"
              className="flex w-full items-center justify-center gap-3 px-10 py-6 text-base sm:w-auto sm:text-lg"
              onClick={() => router.push('/reservation?step=date-guests')}
            >
              Rozpocznij
              <HiArrowRight className="text-xl" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeStep
