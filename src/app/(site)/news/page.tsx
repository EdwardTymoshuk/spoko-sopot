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
  const [featuredItem, ...otherItems] = allNews

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
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-secondary md:text-6xl">
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

        {featuredItem ? (
          <article className="mb-8 overflow-hidden rounded-lg border border-zinc-200 bg-white/65 shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <Link
                href={`/news/${featuredItem.slug}`}
                className="relative block min-h-[320px] overflow-hidden"
              >
                <Image
                  src={featuredItem.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition duration-500 hover:scale-105"
                  priority
                />
              </Link>

              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <NewsStatus item={featuredItem} />
                  {formatDate(featuredItem.publishedAt) ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                      <FiClock className="h-3.5 w-3.5" />
                      {formatDate(featuredItem.publishedAt)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-5 font-serif text-3xl leading-tight text-zinc-950 md:text-5xl">
                  {featuredItem.title}
                </h3>

                {getDateSummary(featuredItem) ? (
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                    <FiCalendar className="h-4 w-4 text-primary" />
                    {getDateSummary(featuredItem)}
                  </p>
                ) : null}

                <p className="mt-5 text-base leading-relaxed text-zinc-500">
                  {featuredItem.description}
                </p>

                <Button
                  asChild
                  className="mt-8 h-11 w-fit gap-2 rounded-lg bg-secondary px-5 text-sm font-semibold text-white hover:bg-secondary/90"
                >
                  <Link href={`/news/${featuredItem.slug}`}>
                    Czytaj więcej
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {otherItems.map((item) => (
            <article
              key={item.id}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white/55 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/75 hover:shadow-md"
            >
              <Link
                href={`/news/${item.slug}`}
                className="relative block aspect-[16/10] overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <NewsStatus item={item} />
                  {formatDate(item.publishedAt) ? (
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                      {formatDate(item.publishedAt)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 font-serif text-2xl leading-tight text-zinc-950">
                  <Link href={`/news/${item.slug}`}>{item.title}</Link>
                </h3>

                {getDateSummary(item) ? (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-500">
                    <FiCalendar className="h-4 w-4 text-primary" />
                    {getDateSummary(item)}
                  </p>
                ) : null}

                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-500">
                  {item.description}
                </p>

                <Link
                  href={`/news/${item.slug}`}
                  className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-secondary transition hover:text-primary"
                >
                  Czytaj więcej
                  <FiArrowRight className="h-4 w-4" />
                </Link>
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
