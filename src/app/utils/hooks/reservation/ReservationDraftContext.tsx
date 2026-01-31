'use client'

import type { ReservationDraft } from '@/app/types/reservation'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  getReservationDraft,
  saveReservationDraft,
} from '../../reservationStorage'

type ReservationDraftContextValue = {
  draft: ReservationDraft
  updateDraft: <K extends keyof ReservationDraft>(
    key: K,
    value: ReservationDraft[K]
  ) => void
  setDraft: React.Dispatch<React.SetStateAction<ReservationDraft>>
}

const ReservationDraftContext =
  createContext<ReservationDraftContextValue | null>(null)

export const ReservationDraftProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [draft, setDraft] = useState<ReservationDraft>(() =>
    getReservationDraft()
  )

  useEffect(() => {
    saveReservationDraft(draft)
  }, [draft])

  const updateDraft: ReservationDraftContextValue['updateDraft'] = (
    key,
    value
  ) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <ReservationDraftContext.Provider value={{ draft, updateDraft, setDraft }}>
      {children}
    </ReservationDraftContext.Provider>
  )
}

export const useReservationDraft = () => {
  const ctx = useContext(ReservationDraftContext)
  if (!ctx) {
    throw new Error(
      'useReservationDraft must be used inside ReservationDraftProvider'
    )
  }
  return ctx
}
