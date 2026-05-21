'use client'

import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import { FaLocationDot } from 'react-icons/fa6'
import { FiCalendar, FiPhoneCall } from 'react-icons/fi'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import HeroCarousel from '../components/HeroCarousel'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import Opinions from '../components/Opinions'

const Home: React.FC = () => {
  return (
    <MainContainer className="w-full">
      <div className="flex flex-col w-full">
        {/* Hero section with carousel */}
        <HeroCarousel />
      </div>

      {/* Visit us section */}
      <section className="w-full bg-[#f7f3ec] py-20">
        <MaxWidthWrapper>
          <div className="grid items-stretch gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Hestii 3, Sopot
              </p>

              <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
                Wpadnij do Spoko
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg">
                Jesteśmy blisko plaży i sopockiego rytmu. Przyjdź na śniadanie,
                spokojny obiad, kawę albo kolację po spacerze nad morzem.
              </p>

              <div className="mt-8 grid gap-4 text-sm text-zinc-600 sm:grid-cols-2">
                <div className="border-l border-primary/45 pl-4">
                  <p className="font-semibold text-secondary">Adres</p>
                  <p className="mt-1 flex items-center gap-2">
                    <FaLocationDot className="text-primary" />
                    Hestii 3, 81-731 Sopot
                  </p>
                </div>

                <div className="border-l border-primary/45 pl-4">
                  <p className="font-semibold text-secondary">Godziny</p>
                  <p className="mt-1">Pon-pt: 10:00 - 19:00</p>
                  <p>Sob-niedz: 8:00 - 19:00</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="gap-2.5 rounded-lg bg-secondary px-6 font-semibold text-white shadow-none hover:bg-secondary/90"
                >
                  <a href="tel:+48530659666">
                    <FiPhoneCall className="h-4 w-4" />
                    Zarezerwuj stolik
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-zinc-300 px-6 font-semibold text-secondary hover:border-primary hover:text-primary"
                >
                  <Link href="/contact">Kontakt</Link>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.356080609364!2d18.58294595188907!3d54.43213053637157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd0b6edee7521f%3A0x324a244fefc976ef!2sRestauracja%20Spoko%20Sopot!5e0!3m2!1suk!2spl!4v1721160082108!5m2!1suk!2spl"
                width="100%"
                height="460"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Restauracji Spoko Sopot"
              ></iframe>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <div className="flex w-full justify-center bg-[#f7f3ec]">
        <Separator className="my-0 w-40 bg-[#ded8cc] sm:w-72 md:w-full md:max-w-4xl" />
      </div>

      <section className="w-full bg-[#f7f3ec] py-20">
        <MaxWidthWrapper>
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Przyjęcia i eventy
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-secondary md:text-5xl">
                Spotkania rodzinne i firmowe z dopracowanym menu
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
                Przygotujemy propozycję dopasowaną do liczby gości, charakteru
                spotkania i oczekiwanej formy serwisu. Ty opowiadasz nam o
                wydarzeniu, my pomagamy ułożyć resztę.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <Button
                asChild
                size="lg"
                className="h-12 w-full justify-center gap-2.5 rounded-lg bg-secondary px-6 font-semibold text-white shadow-none hover:bg-secondary/90 sm:w-72"
              >
                <a
                  href="https://spokosopot.pl/reservation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiCalendar className="h-4 w-4" />
                  Zarezerwuj przyjęcie
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full justify-center gap-2.5 rounded-lg border-zinc-300 bg-transparent px-6 font-semibold text-secondary hover:border-primary hover:text-primary sm:w-72"
              >
                <Link href="/offer">
                  Zobacz ofertę eventową
                  <MdOutlineKeyboardArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <div className="flex w-full justify-center bg-[#f7f3ec]">
        <Separator className="my-0 w-40 bg-[#ded8cc] sm:w-72 md:w-full md:max-w-4xl" />
      </div>

      <section className="w-full bg-[#f7f3ec] py-20">
        <MaxWidthWrapper>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm sm:aspect-[16/10] lg:aspect-[4/5]">
              <Image
                src="/img/team.jpg"
                alt="Zespół Restauracji Spoko w Sopocie"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                O nas
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-secondary md:text-5xl">
                Restauracja w Sopocie przy plaży, z tarasem i widokiem na morze
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
                Spoko to restauracja w Sopocie przy samej plaży, kilka kroków
                od morza. Mamy taras, widok na Zatokę i swobodny, nadmorski
                klimat, który dobrze pasuje do śniadania, spokojnego obiadu
                albo kolacji po spacerze.
              </p>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
                W karcie znajdziesz śniadania, obiady, kolacje, napoje i
                sezonowe propozycje kuchni nadmorskiej. Na co dzień dbamy o
                przyjazne powitanie, sprawną obsługę i atmosferę, w której
                można zostać na dłużej. Zapraszamy też gości z psami.
              </p>

              <div className="mt-8 grid gap-6 border-y border-[#ded8cc] py-6 sm:grid-cols-3">
                {[
                  [
                    'Taras i widok',
                    'Restauracja przy plaży, z miejscem na spokojny posiłek nad morzem.',
                  ],
                  [
                    'Karta na cały dzień',
                    'Śniadania, obiady, kolacje, napoje i sezonowe propozycje.',
                  ],
                  [
                    'Zwierzęta mile widziane',
                    'Swobodna atmosfera dla gości, rodzin i czworonożnych towarzyszy.',
                  ],
                ].map(([title, description]) => (
                  <div key={title}>
                    <div className="mb-3 h-1 w-10 rounded-full bg-primary" />
                    <p className="font-semibold text-secondary">{title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                      {description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-[#ded8cc] pt-6">
                <p className="max-w-2xl text-base leading-relaxed text-zinc-500">
                  O miejscu najlepiej opowiadają goście: wracają za atmosferą,
                  spokojnym tempem i jedzeniem, które pasuje do sopockiego dnia.
                </p>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <div className="flex w-full justify-center bg-[#f7f3ec]">
        <Separator className="my-0 w-40 bg-[#ded8cc] sm:w-72 md:w-full md:max-w-4xl" />
      </div>

      <Opinions />
    </MainContainer>
  )
}

export default Home
