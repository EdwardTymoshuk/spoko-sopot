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
    <div className="h-[100dvh] md:h-full flex flex-col md:flex-row w-full bg-background overflow-hidden">
      {/* IMAGE */}
      <div className="relative h-[40vh] md:h-auto md:w-2/5">
        <Image
          fill
          src="/img/offer/reservation-welcome.webp"
          alt="Eleganckie wnętrze restauracji Spoko"
          className="object-cover"
          priority
        />
        {/* subtle overlay for mobile */}
        <div className="absolute inset-0 bg-black/10 md:hidden" />
      </div>

      {/* CONTENT */}
      <div className="relative flex items-start md:items-center w-full md:w-3/5 px-4 sm:px-6 md:px-16 lg:px-24">
        {/* Card */}
        <div className="relative -mt-16 md:mt-0 bg-white rounded-xl shadow-sm md:shadow-none p-6 sm:p-8 md:p-0 max-w-xl space-y-8">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            Zaplanujmy Twoje wydarzenie krok po kroku
          </h1>

          {/* Body */}
          <div className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
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
          <div className="pt-4">
            <Button
              size="lg"
              className="px-10 py-6 text-lg flex items-center gap-3"
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
