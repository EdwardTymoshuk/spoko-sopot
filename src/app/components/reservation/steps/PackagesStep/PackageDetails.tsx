import type { PackageConfig } from '@/lib/consts'
import React from 'react'

interface Props {
  pkg: PackageConfig
}

/**
 * Section titles depend on package type
 * to correctly reflect the way dishes are served.
 */
const SECTION_TITLES: Record<
  PackageConfig['type'],
  {
    appetizers: string
    main: string
    desserts: string
  }
> = {
  silver: {
    appetizers: 'Przystawka – podawana każdemu gościowi',
    main: 'Danie główne – podawane indywidualnie',
    desserts: 'Deser',
  },
  gold: {
    appetizers: 'Przystawka – podawana każdemu gościowi',
    main: 'Dania główne – półmiski na środek stołu',
    desserts: 'Desery – patery na stół',
  },
  platinum: {
    appetizers: 'Przystawki – półmiski na środek stołu',
    main: 'Dania główne – półmiski',
    desserts: 'Desery – patery na stół',
  },
}

const PackageDetails = ({ pkg }: Props) => {
  const { title, details, type } = pkg
  const titles = SECTION_TITLES[type]

  return (
    <section className="rounded-2xl border bg-muted/40 p-8">
      <h3 className="mb-10 text-2xl font-semibold">
        Szczegóły pakietu {title}
      </h3>

      {/* PRZYSTAWKI */}
      <Section title={titles.appetizers}>
        <ul className="list-disc space-y-1 pl-5">
          {details.appetizers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      {/* ZUPA */}
      {details.soup && (
        <Section
          title={`Zupa (250 ml) ${
            details.soup.mode === 'optional'
              ? `– opcjonalnie (+${details.soup.pricePerPerson} zł / osoba)`
              : '– obowiązkowa'
          }`}
        >
          <ul className="list-disc pl-5 space-y-1">
            {details.soup.choices.map((s) => (
              <li key={s.value}>{s.label}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* DANIA GŁÓWNE */}
      <Section title={titles.main}>
        <ul className="list-disc space-y-1 pl-5">
          {details.main.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      {/* DESERY */}
      <Section title={titles.desserts}>
        <ul className="list-disc space-y-1 pl-5">
          {details.desserts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      {/* NAPOJE */}
      <Section title="Napoje">
        <ul className="list-disc space-y-1 pl-5">
          {details.drinks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>
    </section>
  )
}

export default PackageDetails

/* ------------------------------------------------------------------ */

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <div className="mb-10 space-y-2">
      <h4 className="text-base font-semibold">{title}</h4>
      <div className="text-sm text-zinc-700">{children}</div>
    </div>
  )
}
