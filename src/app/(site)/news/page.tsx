import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { Button } from '@/app/components/ui/button'
import {
  formatDate,
  getNewsItems,
  isNewsEnded,
  type NewsItem,
} from '@/lib/news'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi'

export const dynamic = 'force-dynamic'

const getDateSummary = (item: NewsItem) => {
  const startDate = formatDate(item.eventStartDate)
  const endDate = formatDate(item.eventEndDate)

  if (startDate && endDate && startDate !== endDate) {
    return `${startDate} - ${endDate}`
  }

  return startDate
}

const NewsPage = async () => {
  const allNews = await getNewsItems()

  return (
    <MainContainer className="pt-14 pb-24">
      <PageHeaderContainer
        title="Aktualności"
        image="/img/news-page.jpg"
        imageMobile="/img/news-page-mobile.jpg"
        description="Wydarzenia, sezonowe propozycje i ważne informacje z restauracji Spoko w Sopocie."
      />

      <MaxWidthWrapper className="py-12 md:py-20">
        <div className="mb-12 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Co nowego
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-secondary md:text-5xl">
              Wydarzenia i aktualności
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Publikujemy tu specjalne wieczory, sezonowe propozycje i
              informacje, które warto znać przed wizytą w Spoko.
            </p>
          </div>

          <p className="text-sm font-medium text-zinc-400">
            {allNews.length} {allNews.length === 1 ? 'wpis' : 'wpisów'}
          </p>
        </div>

        <div className="grid gap-6">
          {allNews.map((item, index) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white/65 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-md"
            >
              <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
                <Link
                  href={`/news/${item.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[300px]"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    priority={index === 0}
                  />
                </Link>

                <div className="flex flex-col justify-center p-7 md:p-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <NewsStatus item={item} />
                    {formatDate(item.publishedAt) ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                        <FiClock className="h-3.5 w-3.5" />
                        {formatDate(item.publishedAt)}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-5 text-3xl font-semibold leading-tight text-zinc-950 md:text-5xl">
                    <Link href={`/news/${item.slug}`}>{item.title}</Link>
                  </h3>

                  {getDateSummary(item) ? (
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                      <FiCalendar className="h-4 w-4 text-primary" />
                      {getDateSummary(item)}
                    </p>
                  ) : null}

                  <p className="mt-5 text-base leading-relaxed text-zinc-500">
                    {item.description}
                  </p>

                  <Button
                    asChild
                    className="mt-8 h-11 w-fit gap-2 rounded-lg bg-secondary px-5 text-sm font-semibold text-white hover:bg-secondary/90"
                  >
                    <Link href={`/news/${item.slug}`}>
                      Czytaj więcej
                      <FiArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

const NewsStatus = ({ item }: { item: NewsItem }) =>
  isNewsEnded(item) ? (
    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-zinc-500">
      Zakończone
    </span>
  ) : (
    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-secondary">
      Aktualne
    </span>
  )

export default NewsPage
