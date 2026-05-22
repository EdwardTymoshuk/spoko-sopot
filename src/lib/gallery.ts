export type GalleryCategory =
  | 'dishes'
  | 'terrace'
  | 'interior'
  | 'events'
  | 'details'

export interface GalleryPhoto {
  id: string
  title: string
  alt: string
  src: string
  thumbnail: string
  category: GalleryCategory
  width: number
  height: number
  sortOrder: number
  isFeatured?: boolean
}

export const galleryCategoryLabels: Record<GalleryCategory, string> = {
  dishes: 'Dania',
  terrace: 'Taras i widok',
  interior: 'Wnętrze',
  events: 'Przyjęcia',
  details: 'Dekoracje',
}

const photo = (
  number: number,
  category: GalleryCategory,
  title: string,
  alt: string,
  width: number,
  height: number,
  sortOrder: number,
  isFeatured = false
): GalleryPhoto => ({
  id: `gallery-${number}`,
  title,
  alt,
  src: `/img/gallery/gallery-image-${number}.webp`,
  thumbnail: `/img/gallery/thumb${number}.jpg`,
  category,
  width,
  height,
  sortOrder,
  isFeatured,
})

export const fallbackGalleryPhotos: GalleryPhoto[] = [
  photo(10, 'dishes', 'Dania na wspólnym stole', 'Dania śniadaniowe i obiadowe podane na stole w restauracji Spoko', 1920, 1279, 10, true),
  photo(15, 'dishes', 'Kolacja na tarasie', 'Dania i napoje podane na tarasie restauracji Spoko w Sopocie', 1365, 2047, 20),
  photo(18, 'dishes', 'Danie sezonowe', 'Danie sezonowe podane w restauracji Spoko', 1365, 2048, 30),
  photo(19, 'dishes', 'Słodkie akcenty', 'Kolorowe danie deserowe podane w restauracji Spoko', 1365, 2048, 40),
  photo(20, 'dishes', 'Stek z dodatkami', 'Stek z warzywami podany w restauracji Spoko', 1365, 2048, 50),
  photo(21, 'dishes', 'Danie z grilla', 'Danie z grilla z kaszą i ziołami w restauracji Spoko', 1365, 2048, 60),
  photo(22, 'dishes', 'Posiłek przy stole', 'Goście jedzący dania w restauracji Spoko', 1365, 2048, 70),
  photo(14, 'dishes', 'Owoce morza', 'Krewetka serwowana podczas posiłku w restauracji Spoko', 1365, 2047, 80),

  photo(1, 'terrace', 'Restauracja przy plaży', 'Zewnętrzny widok restauracji Spoko przy plaży w Sopocie', 1920, 1279, 100, true),
  photo(2, 'terrace', 'Wejście do Spoko', 'Wejście i taras restauracji Spoko w Sopocie', 1920, 1279, 110),
  photo(5, 'terrace', 'Jasny taras', 'Zadaszony taras restauracji Spoko z miejscami dla gości', 1365, 2048, 120),
  photo(8, 'terrace', 'Stoliki na tarasie', 'Stoliki i kwiaty na tarasie restauracji Spoko', 1365, 2048, 130),
  photo(12, 'terrace', 'Chwila przy plaży', 'Gość z napojem na huśtawce przy tarasie restauracji Spoko', 1365, 2048, 140),
  photo(16, 'terrace', 'Przy stole na zewnątrz', 'Goście przy stole na tarasie restauracji Spoko', 1365, 2047, 150),
  photo(17, 'terrace', 'Taras Spoko', 'Goście na tarasie restauracji Spoko przy neonowym napisie', 1365, 2048, 160),

  photo(6, 'interior', 'Sala restauracyjna', 'Sala restauracyjna Spoko z niebieskimi fotelami i neonem', 1365, 2048, 200, true),
  photo(7, 'interior', 'Wnętrze z zielenią', 'Jasne wnętrze restauracji Spoko z zielenią i stolikami', 1365, 2048, 210),
  photo(9, 'interior', 'Wnętrze Spoko', 'Wnętrze restauracji Spoko z barem i miejscami dla gości', 1365, 2048, 220),
  photo(13, 'interior', 'Kącik dla dzieci', 'Kącik dla dzieci we wnętrzu restauracji Spoko', 1365, 2048, 230),
  photo(11, 'interior', 'Miejsce dla najmłodszych', 'Kącik dla dzieci w restauracji Spoko', 1365, 2048, 240),

  photo(3, 'details', 'Neon Spoko', 'Neon I love Sopot w restauracji Spoko', 1920, 1279, 300, true),
  photo(4, 'details', 'Zielone detale', 'Dekoracje i zieleń we wnętrzu restauracji Spoko', 1365, 2048, 310),
  photo(23, 'details', 'Sezonowe detale', 'Sezonowy napój i dekoracje w restauracji Spoko', 1365, 2048, 320),
]
