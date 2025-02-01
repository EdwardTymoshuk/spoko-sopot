"use client"

import React from "react"
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"

interface GalleryImage {
	src: string
	thumbnail: string
}

interface CustomGalleryProps {
	images: GalleryImage[]
}

const CustomGallery: React.FC<CustomGalleryProps> = ({ images }) => {
	const formattedImages = images.map((image) => ({
		original: image.src,
		thumbnail: image.thumbnail,
	}))

	return (
		<div className="w-full">
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

export default CustomGallery
