export interface NavBarItem {
	label: string,
	link: string,
}

export interface CarouselImage {
	src: string,
}

export interface Opinion {
	author: string,
	date: string,
	message: string,
	rate: 1 | 2 | 3 | 4 | 5,
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
	'Wege' |
	'Dania rybne' |
	'Owoce morza' |
	'Dania miesne' |
	'Whiskey' |
	'Rum' |
	'Gin' |
	'Cognat/Brandy' |
	'Wódka'

export interface MenuItem {
	name: string,
	price: number,
	description: string,
	category: MenuItemCategory,
	image: string,
}	