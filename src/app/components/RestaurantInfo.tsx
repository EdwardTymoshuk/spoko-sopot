'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type RestaurantInfoData = {
  name: string
  phone: string
  email: string
  address: string
}

type OpeningHour = {
  day: number
  isClosed: boolean
  start: string
  end: string
}

type OpeningHourOverride = {
  id: string
  startDate: string
  endDate: string
  type: 'hours' | 'closed'
  start?: string
  end?: string
  title: string
  message: string
}

type RestaurantPayload = {
  restaurantInfo: RestaurantInfoData
  openingHours: OpeningHour[]
  openingHourOverrides: OpeningHourOverride[]
}

const FALLBACK: RestaurantPayload = {
  restaurantInfo: {
    name: 'Restauracja Spoko',
    phone: '530 659 666',
    email: 'info@spokosopot.pl',
    address: 'Hestii 3, 81-731 Sopot',
  },
  openingHours: [1, 2, 3, 4, 5, 6, 7].map((day) => ({
    day,
    isClosed: false,
    start: day > 5 ? '08:00' : '10:00',
    end: '19:00',
  })),
  openingHourOverrides: [],
}

const SHORT_DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']
const RestaurantInfoContext = createContext<RestaurantPayload>(FALLBACK)

export function RestaurantInfoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RestaurantPayload>(FALLBACK)

  useEffect(() => {
    fetch('/api/restaurant-info', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => payload && setData(payload))
      .catch(() => undefined)
  }, [])

  return <RestaurantInfoContext.Provider value={data}>{children}</RestaurantInfoContext.Provider>
}

function useRestaurantInfo() {
  return useContext(RestaurantInfoContext)
}

function getWarsawDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date())
}

function getRelevantOverride(overrides: OpeningHourOverride[]) {
  const today = getWarsawDate()
  const active = overrides.find((item) => item.startDate <= today && item.endDate >= today)
  if (active) return { item: active, active: true }

  const upcoming = overrides
    .filter((item) => item.startDate > today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0]
  if (!upcoming) return null

  const daysUntil = Math.ceil((Date.parse(`${upcoming.startDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000)
  return daysUntil <= 30 ? { item: upcoming, active: false } : null
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}.${month}.${year}`
}

function groupHours(hours: OpeningHour[]) {
  const sorted = [...hours].sort((a, b) => a.day - b.day)
  return sorted.reduce<Array<{ startDay: number; endDay: number; hour: OpeningHour }>>((groups, hour) => {
    const previous = groups.at(-1)
    if (
      previous &&
      previous.endDay + 1 === hour.day &&
      previous.hour.isClosed === hour.isClosed &&
      previous.hour.start === hour.start &&
      previous.hour.end === hour.end
    ) {
      previous.endDay = hour.day
    } else {
      groups.push({ startDay: hour.day, endDay: hour.day, hour })
    }
    return groups
  }, [])
}

export function RestaurantHoursDisplay({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const { openingHours, openingHourOverrides } = useRestaurantInfo()
  const relevant = useMemo(() => getRelevantOverride(openingHourOverrides), [openingHourOverrides])
  const displayedHours = relevant?.active
    ? openingHours.map((item) => ({ ...item, isClosed: relevant.item.type === 'closed', start: relevant.item.start || item.start, end: relevant.item.end || item.end }))
    : openingHours

  return (
    <div className={className}>
      {groupHours(displayedHours).map(({ startDay, endDay, hour }) => (
        <p key={`${startDay}-${endDay}`}>
          {startDay === endDay ? SHORT_DAYS[startDay - 1] : `${SHORT_DAYS[startDay - 1]}-${SHORT_DAYS[endDay - 1]}`}: {hour.isClosed ? 'nieczynne' : `${hour.start} - ${hour.end}`}
        </p>
      ))}
      {!compact && relevant && (
        <div className="mt-4 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-xs leading-relaxed text-secondary">
          <p className="font-semibold">{relevant.item.title || 'Zmiana godzin otwarcia'}</p>
          <p>{relevant.item.message || (relevant.item.type === 'closed' ? 'Restauracja będzie nieczynna.' : `Godziny: ${relevant.item.start} - ${relevant.item.end}.`)}</p>
          <p className="mt-1 text-zinc-500">{formatDate(relevant.item.startDate)} - {formatDate(relevant.item.endDate)}{!relevant.active ? ' (planowana zmiana)' : ''}</p>
        </div>
      )}
    </div>
  )
}

export function RestaurantContactDisplay() {
  const { restaurantInfo } = useRestaurantInfo()
  return (
    <>
      <a href={`tel:${restaurantInfo.phone.replace(/\s/g, '')}`}>{restaurantInfo.phone}</a>
      <a href={`mailto:${restaurantInfo.email}`} className="underline">{restaurantInfo.email}</a>
    </>
  )
}

export function useRestaurantContact() {
  return useRestaurantInfo().restaurantInfo
}
