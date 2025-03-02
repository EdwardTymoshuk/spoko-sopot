import { forwardRef } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

interface GalleryImage {
  src: string
  thumbnail: string
}

interface CustomGalleryProps {
  images: GalleryImage[]
}

const CustomGallery = forwardRef<HTMLDivElement, CustomGalleryProps>(
  ({ images }, ref) => {
    const formattedImages = images.map((image) => ({
      original: image.src,
      thumbnail: image.thumbnail,
    }))

    return (
      <div ref={ref} className="w-full max-w-full">
        <ImageGallery
          items={formattedImages}
          showThumbnails={true}
          showFullscreenButton={false}
          showPlayButton={false}
          additionalClass="custom-gallery"
        />
      </div>
    )
  }
)

CustomGallery.displayName = 'CustomGallery'

export default CustomGallery
