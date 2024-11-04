'use client'

import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import PageHeaderContainer from '../components/PageHeaderComponent'

const photos = [
  { src: '/img/gallery/gallery-image-1.jpg', thumbnail: '/img/gallery/thumb1.jpg', width: 1200, height: 800 },
  { src: '/img/gallery/gallery-image-2.jpg', thumbnail: '/img/gallery/thumb2.jpg', width: 1200, height: 800 },
  { src: '/img/gallery/gallery-image-3.jpg', thumbnail: '/img/gallery/thumb3.jpg', width: 1200, height: 800 },
  { src: '/img/gallery/gallery-image-1.jpg', thumbnail: '/img/gallery/thumb1.jpg', width: 1200, height: 800 },
  { src: '/img/gallery/gallery-image-2.jpg', thumbnail: '/img/gallery/thumb2.jpg', width: 1200, height: 800 },
  { src: '/img/gallery/gallery-image-3.jpg', thumbnail: '/img/gallery/thumb3.jpg', width: 1200, height: 800 },
  // Додайте більше фото за потреби
]

const GalleryPage = () => {
  return (
    <MainContainer className='pt-20 pb-8'>
      <MaxWidthWrapper>
        <PageHeaderContainer
          title='Galeria'
          image='/img/gallery/gallery-image-1.jpg'
          description='
          
          Zapraszamy do obejrzenia naszej galerii zdjęć, która ukazuje wyjątkowy klimat naszej restauracji. To miejsce, gdzie pasja do gotowania spotyka się z pięknem wnętrz i niezapomnianym widokiem na Bałtyk. Nasza galeria przedstawia momenty, które tworzymy dla naszych gości każdego dnia – od starannie przygotowanych potraw, przez uśmiechniętą obsługę, aż po wyjątkowe wydarzenia, które mają miejsce w naszym lokalu.
Ciesz się widokami naszych specjałów, poznaj nasz zespół i poczuj atmosferę Spoko Sopot jeszcze przed wizytą.
          
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
                  <img
                    ref={ref}
                    onClick={open}
                    src={photo.thumbnail}
                    alt={`Galeria zdjęć ${index + 1}`}
                    className="w-full h-full cursor-pointer"
                  />
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
