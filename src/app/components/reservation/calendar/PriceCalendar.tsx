'use client'

import { Calendar, CalendarDayButton } from '@/app/components/ui/calendar'
import { Card, CardContent } from '@/app/components/ui/card'
import { CalendarAvailabilityVM } from '@/app/types/reservation'
import { cn } from '@/lib/utils'
import { pl } from 'date-fns/locale'

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

const PriceCalendar = ({ value, onChange, availability }: Props) => {
  const availabilityMap = new Map(
    availability.map((d) => [d.date.toDateString(), d])
  )

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-3 sm:p-4 space-y-4">
        {/* CALENDAR */}
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          weekStartsOn={1}
          locale={pl}
          className="
            w-full
            mx-auto
            [--cell-size:--spacing(9.5)]
            sm:[--cell-size:--spacing(10.5)]
            md:[--cell-size:--spacing(12)]
          "
          disabled={(date) => {
            const d = availabilityMap.get(date.toDateString())
            return d?.isBlocked ?? false
          }}
          components={{
            DayButton: ({ day, modifiers, ...props }) => {
              const data = availabilityMap.get(day.date.toDateString())
              const isBlocked = data?.isBlocked ?? false
              const priceInfo = getBasePriceForDate(day.date)

              return (
                <CalendarDayButton
                  {...props}
                  day={day}
                  modifiers={modifiers}
                  className="flex flex-col gap-1 py-1.5"
                >
                  <span className="text-sm font-medium">
                    {day.date.getDate()}
                  </span>

                  {/* DESKTOP ONLY – price in grid */}
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
                </CalendarDayButton>
              )
            },
          }}
        />

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
              Cena :{' '}
              <span className={cn(getBasePriceForDate(value).color)}>
                od {getBasePriceForDate(value).price} zł/os.
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PriceCalendar
