'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FiMail, FiPhoneCall } from 'react-icons/fi'
import { HiArrowRight } from 'react-icons/hi2'
import { MdOutlineHome } from 'react-icons/md'

const ThankYouStep = () => {
  const router = useRouter()

  return (
    <div className="min-h-[100dvh] md:min-h-full flex flex-col md:flex-row w-full bg-background overflow-hidden">
      <div className="relative h-[40vh] md:h-auto md:min-h-full md:w-2/5">
        <Image
          fill
          src="/img/offer/IMG_6720.jpg"
          alt="Wnętrze restauracji Spoko"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-white/5 md:from-black/15 md:via-transparent md:to-transparent" />
      </div>

      <div className="relative flex items-start md:items-center w-full md:w-3/5 px-4 sm:px-6 md:px-16 lg:px-24 py-6 md:py-0">
        <div className="relative -mt-14 md:mt-0 bg-white rounded-xl shadow-sm md:shadow-none p-6 sm:p-8 md:p-0 max-w-xl space-y-7">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            Dziękujemy za zgłoszenie
          </h2>

          <div className="space-y-3 text-base sm:text-lg text-muted-foreground leading-relaxed">
            <p>
              Udało się, Twój formularz został pomyślnie wysłany.
            </p>
            <p>
              Dziękujemy za wypełnienie. Skontaktujemy się z Tobą najszybciej,
              jak to możliwe, aby potwierdzić szczegóły.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm sm:text-base text-foreground font-medium">
              Dodatkowe pytania? Jesteśmy do dyspozycji.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Card className="p-3 border-primary/20 bg-primary/5">
                <a
                  href="tel:+48530659666"
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <FiPhoneCall className="h-3.5 w-3.5" />
                  </span>
                  +48 530 659 666
                </a>
              </Card>

              <Card className="p-3 border-primary/20 bg-primary/5">
                <a
                  href="mailto:info@spokosopot.pl"
                  className="flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <FiMail className="h-3.5 w-3.5" />
                  </span>
                  info@spokosopot.pl
                </a>
              </Card>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              size="lg"
              className="px-8 text-base flex items-center gap-2"
              onClick={() => router.push('/')}
            >
              <MdOutlineHome className="text-lg" />
              Przejdź na stronę główną
            </Button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base text-primary hover:text-primary/80 font-medium px-1 py-2 transition-colors"
              onClick={() => router.push('/reservation?step=welcome')}
            >
              Wypełnij nowy formularz
              <HiArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouStep
