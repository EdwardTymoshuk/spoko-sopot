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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog'

interface NewsItem {
	id: number
	title: string
	image: string
	description: string
	fullDescription: string
	galleryImages: { src: string; thumbnail: string; width?: number; height?: number }[]
}

const NewsPage: React.FC = () => {
	const [news, setNews] = useState<NewsItem[]>([])
	const [loadedNews, setLoadedNews] = useState<NewsItem[]>([])
	const [openDialogId, setOpenDialogId] = useState<number | null>(null)

	useEffect(() => {
		const fetchNews = async () => {
			const fetchedNews = [
				{
					id: 1,
					title: "Walentynkowa Kolacja",
					image: "/img/news/valentines-day-2025/valentines-day-cover.jpg",
					description:
						"Romantyczna kolacja przy muzyce na żywo, z wyjątkowym menu i walentynkowymi dekoracjami.",
					fullDescription: `<h2 class='text-center text-2xl'>Zapraszamy na Walentynkową Kolację w Restauracji Spoko Sopot.</h2>
          <h3 class='text-secondary pt-4'>Co oferujemy?</h3>
          <ul class="list-none pl-4">
          <li>&#9829;&#65039; Kolacja serwowana<br />(2 przystawki, 2 dania główne, 2 desery)</li>
          <li>&#9829;&#65039; 2 kieliszki włoskiego prosecco</li>
          <li>&#9829;&#65039; Muzyka na żywo</li>
          <li>&#9829;&#65039; Walentynkowe dekoracje</li>
          <li>&#9829;&#65039; Bukiet kwiatów dla każdej pary</li>
          </ul>
          <h3 class='text-secondary pt-4'>Kiedy?</h3>
          <span class='pl-4'>&#128198; 14 lutego od godz. 17:00</span>
          <h3 class='text-secondary pt-2'>Jak zarezerwować?</h3>
          <ul class="list-none pl-4">
          <ul>
          <li>&#128241; <a href="tel:530659666">530-659-666</a></li>
          <li>&#128231; <a href="mailto:info@spokosopot.pl">info@spokosopot.pl</a></li>
          <li>&#128187; <a href="https://www.spokosopot.pl" target="_blank">www.spokosopot.pl</a></li>
        </ul>
        
          </ul>`,
					galleryImages: [
						{ src: "/img/news/valentines-day-2025/valentines-day-1.jpg", thumbnail: "/img/news/valentines-day-2025/valentines-day-1.jpg" },
						{ src: "/img/news/valentines-day-2025/valentines-day-2.jpg", thumbnail: "/img/news/valentines-day-2025/valentines-day-2.jpg" },
					],
				},
			]
			setNews(fetchedNews)
		}

		fetchNews()
	}, [])

	useEffect(() => {
		const loadImages = async () => {
			const newsWithDimensions = await Promise.all(
				news.map(async (item) => {
					const galleryImages = await Promise.all(
						item.galleryImages.map(async (img) => {
							const image = new Image()
							image.src = img.src
							await image.decode()
							return {
								...img,
								width: image.naturalWidth,
								height: image.naturalHeight,
							}
						})
					)
					return { ...item, galleryImages }
				})
			)
			setLoadedNews(newsWithDimensions)
		}

		if (news.length > 0) {
			loadImages()
		}
	}, [news])

	return (
		<MainContainer className="pt-20 pb-8">
			<MaxWidthWrapper>
				<PageHeaderContainer
					title="Aktualności"
					image="/img/news-page.jpg"
					imageMobile="/img/news-page-mobile.jpg"
					description="Bądź na bieżąco z tym, co dzieje się w nuestra restauracji. Nowości, wydarzenia i limitowane oferty specjalnie dla Ciebie."
				/>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{loadedNews.map((item) => (
						<Card
							key={item.id}
							className="overflow-hidden flex flex-col justify-center items-center w-full max-w-96"
						>
							<div className="relative w-full h-56">
								<img
									src={item.image}
									alt={item.title}
									className="w-full h-full object-cover object-top rounded-t-lg"
								/>
							</div>
							<CardHeader>
								<CardTitle className='text-secondary'>{item.title}</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col items-center">
								<p>{item.description}</p>
								<Button className="mt-4" onClick={() => setOpenDialogId(item.id)}>
									Sprawdź
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
				{loadedNews.map((item) => (
					<Dialog
						key={item.id}
						open={openDialogId === item.id}
						onOpenChange={(open) => {
							if (!open) {
								setOpenDialogId(null)
							}
						}}
					>
						<DialogContent
							className="w-full md:w-auto max-w-[90%] md:max-w-fit h-screen max-h-[80vh] overflow-auto"
						>
							<DialogHeader>
								<DialogTitle className="text-center text-2xl text-secondary">
									{item.title}
								</DialogTitle>
								<DialogDescription className="text-text-secondary text-start">
									<p id={`dialog-description-${item.id}`} className="sr-only">
										{item.description}
									</p>
									<CustomGallery images={item.galleryImages} />
									{/* Render sanitized HTML content */}
									<div className="mt-6">
										<p
											className="text-lg font-semibold"
											dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.fullDescription) }}
										/>
									</div>
								</DialogDescription>
							</DialogHeader>
							<DialogFooter className="sm:justify-center">
								<h2 className="text-secondary text-center text-lg italic">Do zobaczenia w Spoko :)</h2>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				))}
			</MaxWidthWrapper>
		</MainContainer>
	)
}

export default NewsPage