'use client'

import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { Skeleton } from '@/app/components/ui/skeleton'
import {
  fallbackGalleryPhotos,
  GalleryCategory,
  galleryCategoryLabels,
  GalleryPhoto,
} from '@/lib/gallery'
import Image from 'next/image'
import 'photoswipe/dist/photoswipe.css'
import { useEffect, useMemo, useState } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'

const categories: Array<{ id: 'all' | GalleryCategory; label: string }> = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'dishes', label: galleryCategoryLabels.dishes },
  { id: 'terrace', label: galleryCategoryLabels.terrace },
  { id: 'interior', label: galleryCategoryLabels.interior },
  { id: 'events', label: galleryCategoryLabels.events },
  { id: 'details', label: galleryCategoryLabels.details },
]

const GalleryPage = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(fallbackGalleryPhotos)
  const [activeCategory, setActiveCategory] = useState<'all' | GalleryCategory>(
    'all'
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadGallery = async () => {
      try {
        const response = await fetch(`/api/gallery?timestamp=${Date.now()}`, {
          cache: 'no-store',
        })
        const data = await response.json()

        if (!isMounted) return

        setPhotos(Array.isArray(data) && data.length > 0 ? data : fallbackGalleryPhotos)
      } catch (error) {
        console.error('Błąd pobierania galerii:', error)
        if (isMounted) setPhotos(fallbackGalleryPhotos)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadGallery()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedPhotos = useMemo(
    () => [...photos].sort((a, b) => a.sortOrder - b.sortOrder),
    [photos]
  )

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return sortedPhotos
    return sortedPhotos.filter((photo) => photo.category === activeCategory)
  }, [activeCategory, sortedPhotos])

  const visibleCategories = useMemo(() => {
    const usedCategories = new Set(sortedPhotos.map((photo) => photo.category))
    return categories.filter(
      (category) => category.id === 'all' || usedCategories.has(category.id)
    )
  }, [sortedPhotos])

  return (
    <MainContainer className="pt-14 pb-24">
      <PageHeaderContainer
        title="Galeria"
        image="/img/gallery/gallery-image-1.webp"
        description="Zobacz restaurację Spoko od środka: dania, taras przy plaży, wnętrze, przyjęcia i detale, które tworzą nadmorski klimat miejsca."
      />

      <MaxWidthWrapper className="py-12 md:py-20">
        <div className="mb-10 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Zdjęcia
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
              Spoko w kadrach
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Zobacz nasze dania, taras przy plaży, wnętrze restauracji i
              kadry z przyjęć. To najlepszy sposób, żeby poczuć klimat Spoko
              jeszcze przed wizytą.
            </p>
          </div>

          <p className="text-sm font-medium text-zinc-400">
            {filteredPhotos.length}{' '}
            {filteredPhotos.length === 1 ? 'zdjęcie' : 'zdjęć'}
          </p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category.id
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-[#ded8cc] bg-transparent text-zinc-500 hover:border-primary hover:text-secondary'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-[4/3] w-full rounded-lg bg-zinc-200/70"
              />
            ))}
          </div>
        ) : (
          <Gallery>
            <div className="grid auto-rows-[180px] gap-4 sm:grid-cols-2 md:auto-rows-[220px] lg:grid-cols-3">
              {filteredPhotos.map((photo, index) => (
                <Item
                  key={photo.id}
                  original={photo.src}
                  thumbnail={photo.thumbnail}
                  width={photo.width}
                  height={photo.height}
                >
                  {({ ref, open }) => (
                    <button
                      ref={ref}
                      type="button"
                      onClick={open}
                      className={`group relative overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm ${
                        photo.isFeatured || index % 7 === 0
                          ? 'sm:col-span-2 sm:row-span-2'
                          : ''
                      }`}
                    >
                      <Image
                        src={photo.thumbnail || photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        priority={index < 3}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-left opacity-0 transition group-hover:opacity-100">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          {galleryCategoryLabels[photo.category]}
                        </p>
                        <p className="mt-1 font-serif text-lg text-white">
                          {photo.title}
                        </p>
                      </div>
                    </button>
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
