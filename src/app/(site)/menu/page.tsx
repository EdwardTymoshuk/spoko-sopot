'use client'

import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import { Skeleton } from '@/app/components/ui/skeleton'
import 'photoswipe/dist/photoswipe.css'
import { useEffect, useState } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'
import MainContainer from '../components/MainContainer'
import PageHeaderContainer from '../components/PageHeaderComponent'

interface MenuPageImage {
  src: string
  thumbnail: string
  width: number
  height: number
}

const thumbnails = Array.from({ length: 21 }, (_, index) => ({
  src: `/img/menu/menu-winter-2025/menu-page-${index + 1}.webp`,
  thumbnail: `/img/menu/menu-winter-2025/thumb-menu-page-${index + 1}.webp`,
}))

const MenuPage = () => {
  const [pages, setPages] = useState<MenuPageImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      const loaded: MenuPageImage[] = []

      for (const imgObj of thumbnails) {
        const img = new window.Image()
        img.src = imgObj.src
        try {
          await img.decode()
          loaded.push({
            src: imgObj.src,
            thumbnail: imgObj.thumbnail,
            width: img.naturalWidth,
            height: img.naturalHeight,
          })
        } catch (e) {
          console.error(`Image failed to load: ${imgObj.src}`, e)
        }
      }

      setPages(loaded)
      setLoading(false)
    }

    loadImages()
  }, [])

  return (
    <MainContainer className="pt-20 pb-8">
      <PageHeaderContainer
        description="Zapraszamy do odkrycia wyjątkowych smaków, które przygotowaliśmy specjalnie dla Was. Nasze menu to starannie skomponowana oferta, która łączy w sobie tradycję z nowoczesnością, wykorzystując najlepsze składniki sezonowe. Smacznego!"
        title="Menu"
        image="/img/menu-page.jpg"
        imageMobile="/img/menu-page-mobile.jpg"
      />
      <MaxWidthWrapper>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-full aspect-square rounded-md bg-muted"
              />
            ))}
          </div>
        ) : (
          <Gallery>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((page, index) => (
                <Item
                  key={index}
                  original={page.src}
                  thumbnail={page.thumbnail}
                  width={page.width}
                  height={page.height}
                >
                  {({ ref, open }) => (
                    <div
                      ref={ref}
                      onClick={open}
                      className="w-full aspect-square overflow-hidden cursor-pointer rounded-md border relative"
                    >
                      <img
                        src={page.thumbnail}
                        loading="lazy"
                        alt={`Menu strona ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                </Item>
              ))}
            </div>
          </Gallery>
        )}

        {/* DISLCAIMER */}
        <footer className="mt-24 pb-12 px-4">
          <p className="text-xs text-zinc-400 max-w-3xl mx-auto leading-relaxed text-center">
            *Menu prezentowane na stronie ma charakter orientacyjny i może ulec
            zmianie. Aktualne ceny oraz dostępność dań mogą różnić się od tych
            przedstawionych online. W celu potwierdzenia szczegółów prosimy o
            kontakt z obsługą na miejscu lub wysłanie zapytania na adres:&nbsp;
            <a
              href="mailto:info@spokosopot.pl"
              className="text-amber-600 hover:underline"
            >
              info@spokosopot.pl
            </a>
            .
          </p>
        </footer>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default MenuPage
