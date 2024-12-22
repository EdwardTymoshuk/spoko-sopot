'use client'

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

const thumbnails = Array.from({ length: 12 }, (_, index) => ({
  src: `/img/gallery/gallery-image-${index + 1}.jpg`,
  thumbnail: `/img/gallery/thumb${index + 1}.jpg`,
}))

const GalleryPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const loadImages = async () => {
      const loadedPhotos = await Promise.all(
        thumbnails.map(async (thumb) => {
          const img = new Image()
          img.src = thumb.src
          await img.decode()
          return {
            src: thumb.src,
            thumbnail: thumb.thumbnail,
            width: img.naturalWidth,
            height: img.naturalHeight,
          }
        })
      )
      setPhotos(loadedPhotos)
    }

    loadImages()
  }, [])

  return (
    <MainContainer className='pt-20 pb-8'>
      <MaxWidthWrapper>
        <PageHeaderContainer
          title='Galeria'
          image='/img/gallery/gallery-image-1.jpg'
          description='
          
          Zapraszamy do obejrzenia naszej galerii zdjęć, która ukazuje wyjątkowy klimat naszej restauracji. To miejsce, gdzie pasja do gotowania spotyka się z pięknem wnętrz i niezapomnianym widokiem na Bałtyk. Nasza galeria przedstawia momenty, które tworzymy dla naszych gości każdego dnia – od starannie przygotowanych potraw, przez uśmiechniętą obsługę, aż po wyjątkowe wydarzenia, które mają miejsce w naszym lokalu. Ciesz się widokami naszych specjałów, poznaj nasz zespół i poczuj atmosferę Spoko Sopot jeszcze przed wizytą.
          
          ' />
        <Gallery>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
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
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Item>
            ))}
          </div>
        </Gallery>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default GalleryPage
