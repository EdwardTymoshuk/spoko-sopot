'use client'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { useRouter } from 'next/navigation'

const ThankYouStep = () => {
  const router = useRouter()

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <Card className="p-8 md:p-10 space-y-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold">Dziękujemy!</h2>
        <p className="text-base text-muted-foreground">
          Twoje podsumowanie zostało wysłane. Skontaktujemy się z Tobą tak
          szybko, jak to możliwe.
        </p>

        <div className="pt-2">
          <Button type="button" onClick={() => router.push('/reservation?step=welcome')}>
            Wróć do początku
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default ThankYouStep
