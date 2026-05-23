'use client'

import type { NewsGalleryImage } from '@/lib/news'
import Image from 'next/image'
import 'photoswipe/dist/photoswipe.css'
import { useEffect, useState } from 'react'
import { Gallery, Item } from 'react-photoswipe-gallery'

interface NewsEntryGalleryProps {
  images: NewsGalleryImage[]
}

const NewsEntryGallery = ({ images }: NewsEntryGalleryProps) => {
  const [items, setItems] = useState(images)

  useEffect(() => {
    let isMounted = true

    const loadDimensions = async () => {
      const nextItems = await Promise.all(
        images.map(
          (item) =>
            new Promise<NewsGalleryImage>((resolve) => {
              const image = new window.Image()
              image.onload = () => {
                resolve({
                  ...item,
                  width: image.naturalWidth || item.width,
                  height: image.naturalHeight || item.height,
                })
              }
              image.onerror = () => resolve(item)
              image.src = item.src
            })
        )
      )

      if (isMounted) setItems(nextItems)
    }

    loadDimensions()

    return () => {
      isMounted = false
    }
  }, [images])

  if (images.length <= 1) {
    return null
  }

  return (
    <Gallery>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((image, index) => (
          <Item
            key={`${image.src}-${index}`}
            original={image.src}
            thumbnail={image.thumbnail || image.src}
            width={image.width || 1600}
            height={image.height || 1200}
          >
            {({ ref, open }) => (
              <button
                ref={ref}
                type="button"
                onClick={open}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100"
              >
                <Image
                  src={image.thumbnail || image.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  )
}

export default NewsEntryGallery
