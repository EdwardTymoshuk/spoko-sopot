'use client'

import { Calendar, CalendarDayButton } from '@/app/components/ui/calendar'
import { Card, CardContent } from '@/app/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { CalendarAvailabilityVM } from '@/app/types/reservation'
import { cn } from '@/lib/utils'
import { pl } from 'date-fns/locale'
import { useEffect, useState } from 'react'

type Props = {
  value?: Date
  onChange: (date: Date | undefined) => void
  availability: CalendarAvailabilityVM[]
}

/**
 * Pricing rules:
 * - Mon–Wed: 250 zł (success)
 * - Thu: 299 zł (warning)
 * - Fri–Sat: 350 zł (danger)
 * - Sun: 250 zł (success)
 */
const getBasePriceForDate = (date: Date) => {
  const day = date.getDay() // 0 = Sunday, 1 = Monday

  if (day >= 1 && day <= 3) {
    return { price: 250, color: 'text-success' }
  }

  if (day === 4) {
    return { price: 299, color: 'text-warning' }
  }

  if (day === 5 || day === 6) {
    return { price: 350, color: 'text-destructive' }
  }

  return { price: 250, color: 'text-success' }
}

const clampRatio = (ratio: number) => Math.max(0, Math.min(1, ratio))

const isSeasonBlockedDate = (date: Date) => {
  const month = date.getMonth() + 1 // 1-12
  return month === 7 || month === 8
}

const getLoadBarColor = (ratio: number) => {
  if (ratio >= 0.75) return 'bg-destructive'
  if (ratio > 0.5) return 'bg-warning'
  return 'bg-success'
}

const PriceCalendar = ({ value, onChange, availability }: Props) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const apply = () => setIsMobile(media.matches)

    apply()
    media.addEventListener('change', apply)

    return () => media.removeEventListener('change', apply)
  }, [])

  const availabilityMap = new Map(
    availability.map((d) => [d.date.toDateString(), d])
  )
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-3 sm:p-4 space-y-3">
        {/* MOBILE – selected day info */}
        {value && (
          <div className="md:hidden rounded-lg border p-3">
            <p className="font-medium">
              Wybrana data:{' '}
              <span className="text-sm text-muted-foreground capitalize">
                {value.toLocaleDateString('pl-PL', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </p>
            <p className="font-medium">
              Cena:{' '}
              <span className={cn(getBasePriceForDate(value).color)}>
                od {getBasePriceForDate(value).price} zł/os.
              </span>
            </p>
          </div>
        )}

        {/* CALENDAR */}
        <TooltipProvider>
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            showOutsideDays={!isMobile}
            weekStartsOn={1}
            locale={pl}
            className="
              w-full
              mx-auto
              [--cell-size:2.15rem]
              sm:[--cell-size:2.55rem]
              md:[--cell-size:4rem]
            "
            disabled={(date) => {
              const d = availabilityMap.get(date.toDateString())
              const isPastDate = date < today
              const isBlocked = d?.isBlocked ?? false
              const isSeasonBlocked = isSeasonBlockedDate(date)
              return isPastDate || isBlocked || isSeasonBlocked
            }}
            components={{
              DayButton: ({ day, modifiers, ...props }) => {
                const data = availabilityMap.get(day.date.toDateString())
                const isSeasonBlocked = isSeasonBlockedDate(day.date)
                const isBlocked = isSeasonBlocked || (data?.isBlocked ?? false)
                const priceInfo = getBasePriceForDate(day.date)
                const occupancyRatio = isSeasonBlocked
                  ? 1
                  : clampRatio(data?.occupancyRatio ?? 0)
                const tooltipLabel =
                  isSeasonBlocked
                    ? 'W lipcu i sierpniu nie przyjmujemy eventów.'
                    : (typeof data?.reason === 'string' && data.reason.trim()) ||
                      'Termin zarezerwowany'

                const dayButton = (
                  <CalendarDayButton
                    {...props}
                    day={day}
                    modifiers={modifiers}
                    className="flex h-full flex-col items-center justify-center md:gap-1 md:py-1.5"
                  >
                    <span className="text-[13px] sm:text-sm font-medium">
                      {day.date.getDate()}
                    </span>

                    <div className="hidden md:block">
                      {!isBlocked && (
                        <span
                          className={cn(
                            'text-[11px] font-medium leading-none',
                            priceInfo.color
                          )}
                        >
                          od {priceInfo.price} zł
                        </span>
                      )}

                      {isBlocked && (
                        <span className="text-[11px] text-destructive">
                          zajęte
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 h-1.5 w-7 overflow-hidden rounded-full bg-muted/70 md:mt-1 md:w-8">
                      <div
                        className={cn(
                          'h-full w-full rounded-full transition-all',
                          getLoadBarColor(occupancyRatio)
                        )}
                      />
                    </div>
                  </CalendarDayButton>
                )

                if (!isBlocked) {
                  return dayButton
                }

                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="block h-full w-full">{dayButton}</span>
                    </TooltipTrigger>
                    <TooltipContent>{tooltipLabel}</TooltipContent>
                  </Tooltip>
                )
              },
            }}
          />
        </TooltipProvider>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-medium">Obłożenie dnia:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-5 rounded-full bg-success" />
            <span>0-50%</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-5 rounded-full bg-warning" />
            <span>51-74%</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-5 rounded-full bg-destructive" />
            <span>75-100%</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default PriceCalendar
