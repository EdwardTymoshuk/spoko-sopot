export interface NavBarItem {
	label: string,
	link: string,
}

export interface CarouselImage {
	src: string,
	srcMobile?: string,
}

export interface MongoDBReview {
	_id: string
	author: string
	message: string
	rating: number
	date: string // дата у форматі ISO (string)
}
export type MenuItemCategory =
	'Dania główne' |
	'Pizza' |
	'Burgery' |
	'Dla dzieci' |
	'Dodatki' |
	'Desery' |
	'Napoje' |
	'Śniadania' |
	'Przystawki' |
	'Zupy' |
	'Bowle' |
	'Vege' |
	'Dania rybne' |
	'Owoce morza' |
	'Dania mięsne' |
	'Klasyczne koktaile' |
	'Na ciepło' |
	'Herbata' |
	'Kawa' |
	'Napoje zimne' |
	'Piwo butelkowe' |
	'Piwo bezalkoholowe' |
	'Piwo beczkowe' |
	'Piwo smakowe' |
	'Wina Białe' |
	'Wina Czerwone' |
	'Wina Musujące' |
	'Drinki' |
	'Whisky' |
	'Rum' |
	'Gin' |
	'Tequila' |
	'Cognac / Brandy' |
	'Wódka' |
	'Napoje alkoholowe' |
	'Napoje bezalkoholowe' |
	'Napoje łekkoprocentowe' |
	'Inne'

// Тип для позицій меню
export interface MenuItemType {
	id: string,
	name: string,
	price: number,
	description: string | null | undefined,
	category: MenuItemCategory,
	image: string | null | undefined,
	isOrderable?: boolean,
	isRecommended?: boolean,
	isOnMainPage?: boolean
	createdAt: Date,
	updatedAt: Date,
}