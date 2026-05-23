import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import { Button } from '@/app/components/ui/button'
import {
  formatDate,
  getNewsItemBySlug,
  isNewsEnded,
} from '@/lib/news'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMail,
  FiPhoneCall,
} from 'react-icons/fi'
import NewsEntryGallery from './NewsEntryGallery'

export const dynamic = 'force-dynamic'

interface NewsDetailsPageProps {
  params: {
    slug: string
  }
}

const getDateSummary = (
  start?: string | Date | null,
  end?: string | Date | null
) => {
  const startDate = formatDate(start)
  const endDate = formatDate(end)

  if (startDate && endDate && startDate !== endDate) {
    return `${startDate} - ${endDate}`
  }

  return startDate
}

export async function generateMetadata({
  params,
}: NewsDetailsPageProps): Promise<Metadata> {
  const item = await getNewsItemBySlug(params.slug)

  if (!item) {
    return {
      title: 'Aktualność | Spoko Sopot',
    }
  }

  return {
    title: `${item.title} | Spoko Sopot`,
    description: item.description,
    openGraph: {
      title: item.title,
      description: item.description,
      images: item.image ? [{ url: item.image }] : undefined,
    },
  }
}

const NewsDetailsPage = async ({ params }: NewsDetailsPageProps) => {
  const item = await getNewsItemBySlug(params.slug)

  if (!item) {
    notFound()
  }

  const eventDate = getDateSummary(item.eventStartDate, item.eventEndDate)
  const galleryImages = item.galleryImages.length
    ? item.galleryImages
    : item.image
      ? [{ src: item.image, thumbnail: item.image }]
      : []

  return (
    <MainContainer className="pt-14 pb-24">
      <section className="w-full pt-6 md:pt-12 lg:pt-14">
        <MaxWidthWrapper className="max-w-screen-2xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-primary"
          >
            <FiArrowLeft className="h-4 w-4" />
            Wróć do aktualności
          </Link>

          <header className="mt-10 border-b border-zinc-200 pb-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Aktualności
              </span>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                {isNewsEnded(item) ? 'Zakończone' : 'Aktualne'}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight text-secondary md:text-6xl">
              {item.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-500 md:text-lg">
              {item.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-zinc-500">
              {eventDate ? (
                <span className="inline-flex items-center gap-2">
                  <FiCalendar className="h-4 w-4 text-primary" />
                  {eventDate}
                </span>
              ) : null}
              {formatDate(item.publishedAt) ? (
                <span className="inline-flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-primary" />
                  Opublikowano {formatDate(item.publishedAt)}
                </span>
              ) : null}
            </div>
          </header>

          <div className="grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] 2xl:gap-14">
            <div className="min-w-0">
              <article>
                <div
                  className="text-base leading-relaxed text-zinc-600 [&_a]:font-semibold [&_a]:text-secondary [&_a]:transition [&_a:hover]:text-primary [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-zinc-950 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-zinc-950 [&_li]:mb-2 [&_p]:mb-6 [&_section]:space-y-8 [&_strong]:text-zinc-950"
                  dangerouslySetInnerHTML={{ __html: item.fullDescription }}
                />
              </article>

              {galleryImages.length > 1 ? (
                <section className="pt-8">
                  <div className="mb-8 flex items-end justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        Zdjęcia
                      </p>
                      <h2 className="mt-3 text-4xl font-semibold text-secondary">
                        Galeria wpisu
                      </h2>
                    </div>
                  </div>

                  <NewsEntryGallery images={galleryImages} />
                </section>
              ) : null}
            </div>

            <aside className="h-fit rounded-lg border border-zinc-200 bg-white/55 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Rezerwacje i pytania
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
                Chcesz dopytać o szczegóły?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Skontaktuj się z nami telefonicznie albo napisz wiadomość,
                jeśli chcesz ustalić szczegóły.
              </p>

              <div className="mt-6 grid gap-3">
                <Button
                  asChild
                  className="h-11 gap-2 rounded-lg bg-secondary text-sm font-semibold text-white hover:bg-secondary/90"
                >
                  <a href="tel:+48530659666">
                    <FiPhoneCall className="h-4 w-4" />
                    Zadzwoń
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 gap-2 rounded-lg border-zinc-300 text-sm font-semibold text-secondary hover:border-primary hover:text-primary"
                >
                  <a
                    href={`mailto:info@spokosopot.pl?subject=${encodeURIComponent(`Pytanie o wydarzenie: ${item.title}`)}`}
                  >
                    <FiMail className="h-4 w-4" />
                    Napisz
                  </a>
                </Button>
              </div>
            </aside>
          </div>
        </MaxWidthWrapper>
      </section>
    </MainContainer>
  )
}

export default NewsDetailsPage
