'use client'

import CustomGallery from '@/app/components/CustomGallery'
import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import 'photoswipe/dist/photoswipe.css'
import { useEffect, useState } from 'react'
import { IoHeartSharp } from 'react-icons/io5'

interface NewsItem {
  id: string
  title: React.ReactNode
  image: string
  description: string
  fullDescription: string
  galleryImages: { src: string; thumbnail: string }[]
}

const valentinesEvent: NewsItem = {
  id: 'valentines-2026',
  title: (
    <span className="flex items-center justify-center gap-2">
      <IoHeartSharp className="text-danger" />
      Wieczór Walentynkowy w Spoko
      <IoHeartSharp className="text-danger" />
    </span>
  ),
  image: '/img/news/valentines-day-2026/valentines-1.webp',
  description:
    'Romantyczny wieczór dla dwojga – specjalne menu, muzyka na żywo i wyjątkowy klimat.',
  fullDescription: `
    <section class="space-y-7">
  
      <!-- HEADER -->
      <div class="text-center space-y-2">
        <h3 class="text-2xl font-semibold text-secondary">
          🌹 Walentynki w Spoko
        </h3>
        <p class="text-sm text-secondary">
          14 lutego • 17:00 – 19:00
        </p>
      </div>
  
      <p class="text-base leading-relaxed">
        Zapraszamy na wyjątkowy wieczór walentynkowy w romantycznej oprawie:
        <strong>czerwone akcenty, świece, żywe kwiaty</strong> i atmosfera idealna na randkę ❤️
      </p>
  
      <!-- MENU -->
      <div class="rounded-xl border p-5 space-y-4 bg-muted/30">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-semibold flex items-center gap-2">
            🍽 Menu walentynkowe
          </h4>
          <span class="text-sm font-medium text-secondary">
            400 zł / para
          </span>
        </div>
  
        <ul class="space-y-3 text-sm">
  
          <li>
            🥂 <strong>Przystawka (do wyboru):</strong><br/>
            burrata z truflą i gruszką <span class="text-muted-foreground">lub</span>
            rostbef z chipsen z parmezanu
          </li>
  
          <li>
            🍖 <strong>Danie główne (do wyboru):</strong><br/>
            kaczka z purée dyniowym <span class="text-muted-foreground">lub</span>
            sandacz z kruszonką z topinamburu
          </li>
  
          <li>
            🍰 <strong>Deser do dzielenia:</strong><br/>
            fondant Yin & Yang + sorbet gruszkowy
          </li>
  
          <li>
            🍸 <strong>2 drinki (do wyboru):</strong><br/>
            Cierpki Pocałunek • Spice Girl • Smak Jego Ust • Trzeźwy Kapitan
          </li>
  
        </ul>
      </div>
  
      <!-- ATRAKCJE -->
      <div class="space-y-3">
        <h4 class="text-lg font-semibold flex items-center gap-2">
          🎶 Atrakcje wieczoru
        </h4>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Muzyka na żywo – wokal & elektroniczne pianino</li>
          <li>Cupidon na sali – subtelnie, z humorem</li>
          <li>Urocze niespodzianki na stołach</li>
        </ul>
      </div>
  
      <!-- CTA -->
      <div class="rounded-xl bg-secondary/10 p-5 text-center space-y-2">
        <p class="font-medium text-base">
          Liczba miejsc ograniczona
        </p>
        <p class="text-sm">
        📞 <a href="tel:+48530659666" class="font-semibold text-secondary hover:underline">
        530 659 666
      </a><br/>
      
      ✉️ <a href="mailto:info@spokosopot.pl" class="font-semibold text-secondary hover:underline">
        info@spokosopot.pl
      </a>
      
        </p>
      </div>
  
    </section>
  `,

  galleryImages: [
    {
      src: '/img/news/valentines-day-2026/valentines-1.webp',
      thumbnail: '/img/news/valentines-day-2026/valentines-1.webp',
    },
    {
      src: '/img/news/valentines-day-2026/valentines-2.webp',
      thumbnail: '/img/news/valentines-day-2026/valentines-2.webp',
    },
  ],
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const allNews = [valentinesEvent, ...news]

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news')
        const data = await res.json()
        setNews(data)
      } catch (error) {
        console.error('Błąd pobierania newsów:', error)
      }
    }

    fetchNews()
  }, [])

  return (
    <MainContainer className="pt-20 pb-8">
      <PageHeaderContainer
        title="Aktualności"
        image="/img/news-page.jpg"
        imageMobile="/img/news-page-mobile.jpg"
        description="Bądź na bieżąco z tym, co dzieje się w naszej restauracji. Nowości, wydarzenia i limitowane oferty specjalnie dla Ciebie."
      />
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {[valentinesEvent, ...news].map((item) => (
            <Card
              key={item.id}
              className="h-full flex flex-col w-full max-w-96"
            >
              <div className="relative w-full h-64">
                <img
                  src={item.image}
                  alt={item.id}
                  className="w-full h-full object-cover object-top rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-secondary text-center">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow w-full">
                <p className="mb-4">{item.description}</p>
                <div className="mt-auto self-center">
                  <Button onClick={() => setOpenDialogId(item.id)}>
                    Sprawdź
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {allNews.map((item) => (
          <Dialog
            key={item.id}
            open={openDialogId === item.id}
            onOpenChange={(open) => {
              if (!open) {
                setOpenDialogId(null)
              }
            }}
          >
            <DialogContent className="w-full md:w-auto max-w-[90%] md:max-w-3xl h-auto max-h-[80vh] overflow-y-auto p-4">
              <DialogHeader>
                <DialogTitle className="text-center pt-4"></DialogTitle>
                <DialogDescription className="text-text-secondary text-start">
                  <CustomGallery images={item.galleryImages} />
                  <div className="mt-6">
                    <div
                      className="text-lg"
                      dangerouslySetInnerHTML={{
                        __html: item.fullDescription,
                      }}
                    />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <h2 className="text-secondary text-center text-lg italic">
                  Do zobaczenia w Spoko :)
                </h2>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default NewsPage
