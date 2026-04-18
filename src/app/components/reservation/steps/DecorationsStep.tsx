'use client'

import { Check, Sparkles, Waves } from 'lucide-react'
import Image from 'next/image'

const includedItems = [
  'Granatowy bieżnik',
  'Serwetniki',
  'Serwetki indywidualne',
  'Świeczniki',
  'Pełna zastawa',
]

const DecorationsStep = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">

        {/* Left — info & checklist */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Dekoracja stołu na przyjęcie
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              W cenie przyjęcia przygotowujemy bazową dekorację stołu, spójną
              z charakterem Restauracji Spoko.
            </p>
          </div>

          {/* Included items */}
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
            <div className="border-b border-primary/15 px-5 py-3.5">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                W cenie przyjęcia otrzymają Państwo
              </p>
            </div>
            <ul className="divide-y divide-border/60">
              {includedItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm md:text-base"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Climate note */}
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3.5 text-sm md:text-base text-zinc-700">
            <Waves className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span className="leading-relaxed">
              Klimat morski dopasowany do charakteru Restauracji Spoko.
            </span>
          </div>
        </div>

        {/* Right — photo */}
        <div className="flex flex-col gap-2 lg:sticky lg:top-4 lg:self-stretch">
          <div className="relative min-h-[340px] flex-1 overflow-hidden rounded-2xl shadow-md">
            <Image
              src="/img/offer/offer.webp"
              alt="Nakrycie stołu z granatowym bieżnikiem"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Przykładowe nakrycie stołu — Restauracja Spoko
          </p>
        </div>

      </div>
    </div>
  )
}

export default DecorationsStep
