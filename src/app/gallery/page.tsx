'use client'

import { Skeleton } from '@/app/components/ui/skeleton'
import 'photoswipe/dist/photoswipe.css'
import { useEffect, useState } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import PageHeaderContainer from '../components/PageHeaderComponent'

interface Photo {
  src: string
  thumbnail: string
  width: number
  height: number
}

const thumbnails = Array.from({ length: 23 }, (_, index) => ({
  src: `/img/gallery/gallery-image-${index + 1}.webp`,
  thumbnail: `/img/gallery/thumb${index + 1}.jpg`,
}))

/**
 * GalleryPage
 * ------------------------------------------------------------------
 * Displays restaurant photo gallery using PhotoSwipe.
 * Shows loading skeletons while images are being loaded.
 */
const GalleryPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const loadedPhotos: Photo[] = []
      for (const thumb of thumbnails) {
        const img = new window.Image()
        img.src = thumb.src
        try {
          await img.decode()
          loadedPhotos.push({
            src: thumb.src,
            thumbnail: thumb.thumbnail,
            width: img.naturalWidth,
            height: img.naturalHeight,
          })
        } catch (e) {
          console.error(`Image failed to load: ${thumb.src}`, e)
        }
      }
      setPhotos(loadedPhotos)
      setLoading(false)
    }

    loadImages()
  }, [])

  return (
    <MainContainer className="pt-20 pb-8">
      <MaxWidthWrapper>
        <PageHeaderContainer
          title="Galeria"
          image="/img/gallery/gallery-image-1.webp"
          description="
            Zapraszamy do obejrzenia naszej galerii zdjęć, która ukazuje wyjątkowy klimat naszej restauracji. 
            To miejsce, gdzie pasja do gotowania spotyka się z pięknem wnętrz i niezapomnianym widokiem na Bałtyk. 
            Nasza galeria przedstawia momenty, które tworzymy dla naszych gości każdego dnia – od starannie przygotowanych potraw, 
            przez uśmiechniętą obsługę, aż po wyjątkowe wydarzenia, które mają miejsce w naszym lokalu. 
            Ciesz się widokami naszych specjałów, poznaj nasz zespół i poczuj atmosferę Spoko Sopot jeszcze przed wizytą.
          "
        />

        {loading ? (
          // Skeleton grid displayed while photos are loading
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full aspect-square rounded-md bg-muted"
              />
            ))}
          </div>
        ) : (
          <Gallery>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos
                .slice()
                .sort((a, b) => {
                  const numA = Number(
                    a.src.match(/gallery-image-(\d+)\.webp/)?.[1] || 0
                  )
                  const numB = Number(
                    b.src.match(/gallery-image-(\d+)\.webp/)?.[1] || 0
                  )
                  return numB - numA
                })
                .map((photo, index) => (
                  <Item
                    key={index}
                    original={photo.src}
                    thumbnail={photo.thumbnail}
                    width={photo.width}
                    height={photo.height}
                  >
                    {({ ref, open }) => (
                      <div
                        ref={ref}
                        onClick={open}
                        className="w-full aspect-square overflow-hidden cursor-pointer relative"
                      >
                        <img
                          src={photo.thumbnail}
                          alt={`Galeria zdjęć ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                  </Item>
                ))}
            </div>
          </Gallery>
        )}
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default GalleryPage
