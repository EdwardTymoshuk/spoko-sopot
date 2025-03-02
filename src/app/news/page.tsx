'use client'

import DOMPurify from 'dompurify'
import 'photoswipe/dist/photoswipe.css'
import { useEffect, useState } from 'react'
import CustomGallery from '../components/CustomGallery'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import PageHeaderContainer from '../components/PageHeaderComponent'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'

interface NewsItem {
  id: string
  title: string
  image: string
  description: string
  fullDescription: string
  galleryImages: { src: string; thumbnail: string }[]
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news')
        const data = await res.json()
        console.log('Pobrane dane:', data)
        setNews(data)
      } catch (error) {
        console.error('Błąd pobierania newsów:', error)
      }
    }

    fetchNews()
  }, [])

  return (
    <MainContainer className="pt-20 pb-8">
      <MaxWidthWrapper>
        <PageHeaderContainer
          title="Aktualności"
          image="/img/news-page.jpg"
          imageMobile="/img/news-page-mobile.jpg"
          description="Bądź na bieżąco z tym, co dzieje się w naszej restauracji. Nowości, wydarzenia i limitowane oferty specjalnie dla Ciebie."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {news.map((item) => (
            <Card
              key={item.id}
              className="h-full flex flex-col w-full max-w-96"
            >
              <div className="relative w-full h-64">
                <img
                  src={item.image}
                  alt={item.title}
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

        {news.map((item) => (
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
                        __html: DOMPurify.sanitize(item.fullDescription),
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
