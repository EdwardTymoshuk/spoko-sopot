import type { MongoDBReview } from '@/app/types'

// Jednorazowy stan opinii Google z 07.10.2026. Strona nie odświeża tych danych.
export const GOOGLE_REVIEWS_SNAPSHOT: {
  capturedAt: string
  averageRating: number
  totalReviews: number
  reviews: MongoDBReview[]
} = {
  capturedAt: '07.10.2026',
  averageRating: 4.6,
  totalReviews: 2293,
  reviews: [
    {
      _id: 'google-1791345532',
      author: 'Ilona Bujalska',
      date: '07.10.2026',
      message:
        'Bardzo przyjemne miejsce. Zaskoczyła mnie jakość obsługi.  Pani byla bardzo sympatyczna, nie narzucająca się a jednocześnie dbająca o każdego. Dania byly bardzo smaczne. Polecam z czystym sercem.',
      rating: 5,
    },
    {
      _id: 'google-1791130026',
      author: 'Joanna Paziewska',
      date: '04.10.2026',
      message:
        'Zajrzeliśmy na obiad podczas weekendu w Sopocie. Pan kelner bardzo miły i kompetentny. Mąż jedzeniem zachwycony - miał mirune. Mój dorsz był trochę za suchy.',
      rating: 5,
    },
    {
      _id: 'google-1791118740',
      author: 'Artur Loeb',
      date: '04.10.2026',
      message: 'Ocena bez komentarza.',
      rating: 5,
    },
    {
      _id: 'google-1791042429',
      author: 'ainia krawiec',
      date: '03.10.2026',
      message: 'Jedzonko bardzo pyszne. Czas oczekiwania 20 minut . Godne polecenia i powrotu.',
      rating: 5,
    },
    {
      _id: 'google-1790855437',
      author: 'Piotr Filipek infinito',
      date: '01.10.2026',
      message: 'Ocena bez komentarza.',
      rating: 5,
    },
  ],
}
