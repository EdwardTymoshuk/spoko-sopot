'use client'

import { ChangeEvent } from 'react'

type Props = {
  value: number
  onChange: (v: number) => void
}

const MIN_ONLINE = 8
const MIN_MENU = 12

const GuestsCounter = ({ value, onChange }: Props) => {
  const isTooSmall = value < MIN_ONLINE
  const hasServiceFee = value >= MIN_ONLINE

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value)
    if (Number.isNaN(next)) return
    onChange(Math.max(1, next))
  }

  return (
    <div className="w-full max-w-sm space-y-5 text-center">
      {/* COUNTER */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="h-11 w-11 rounded-full border text-xl hover:bg-muted transition-colors"
        >
          –
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          className="
            w-20
            text-center
            text-4xl
            font-serif
            border-b
            bg-transparent
            outline-none
            focus:border-primary
          "
        />

        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="h-11 w-11 rounded-full border text-xl hover:bg-muted transition-colors"
        >
          +
        </button>
      </div>

      {/* BLOCKING MESSAGE – only if < 8 */}
      {isTooSmall && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive text-center">
          <p className="font-medium">
            Rezerwacje online realizujemy od <b>{MIN_ONLINE} osób dorosłych</b>.
          </p>
          <p className="mt-1">
            Dla mniejszych grup zapraszamy do kontaktu telefonicznego.
          </p>

          <a
            href="tel:+48530659666"
            className="mt-3 inline-flex items-center gap-2 font-medium hover:underline"
          >
            📞 Zadzwoń: 530&nbsp;659&nbsp;666
          </a>
        </div>
      )}

      {/* SERVICE FEE INFO – only if >= 8 */}
      {hasServiceFee && (
        <div className="rounded-lg bg-warning/10 px-4 py-3 text-sm text-warning">
          Dla grup <b>od {MIN_ONLINE} osób</b> doliczamy <b>serwis 10%</b> dla
          personelu.
        </div>
      )}

      {/* MENU INFO – always visible, calm */}
      <p className="text-sm text-muted-foreground">
        Przyjęcia z indywidualnym menu realizujemy od minimum{' '}
        <b>{MIN_MENU} osób dorosłych</b>.
      </p>

      {/* FOOTNOTE */}
      <p className="text-xs text-muted-foreground">
        * Za osoby dorosłe uznajemy osoby powyżej 12 roku życia.
      </p>
    </div>
  )
}

export default GuestsCounter
