'use client'

import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import MainContainer from '../components/MainContainer'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import PageHeaderContainer from '../components/PageHeaderComponent'

const contactFormSchema = z.object({
	name: z
		.string()
		.min(1, 'Proszę podać imię') // Перевірка на порожнє значення
		.refine((value) => value.length >= 2, { message: 'Imię musi zawierać przynajmniej 2 znaki' }), // Додаткова перевірка довжини

	email: z
		.string()
		.min(1, 'Proszę podać email')
		.email('Podaj prawidłowy adres email'),

	message: z
		.string()
		.min(1, 'Proszę wpisać wiadomość')
		.refine((value) => value.length >= 10, { message: 'Wiadomość musi zawierać przynajmniej 10 znaków' }),

	consent: z.boolean()
		.refine(value => value === true, {
			message: 'Proszę wyrazić zgodę na przetwarzanie danych',
		}),
})


type ContactFormData = z.infer<typeof contactFormSchema>

const ContactPage = () => {
	const form = useForm<ContactFormData>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: '',
			email: '',
			message: '',
			consent: false,
		},
	})

	const onSubmit = async (data: ContactFormData) => {
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			if (response.ok) {
				toast.success('Dziękujemy za kontakt! Twoja wiadomość została wysłana.')
				form.reset()
			} else {
				const error = await response.json()
				toast.error(`Błąd: ${error.error || 'Nie udało się wysłać wiadomości'}`)
			}
		} catch (error) {
			console.error('Błąd podczas wysyłania wiadomości:', error)
			toast.error('Wystąpił błąd podczas wysyłania wiadomości.')
		}
	}


	return (
		<>
			<Head>
				<title>Kontakt | Restauracja Spoko</title>
				<meta
					name="description"
					content="Skontaktuj się z Restauracją Spoko w Sopocie. Zadzwoń, napisz email lub odwiedź nas na ul. Hestii 3. Odkryj wyjątkowe smaki i niezapomnianą atmosferę!"
				/>
				<meta
					name="keywords"
					content="kontakt, Restauracja Spoko, Sopot, godziny otwarcia, rezerwacja, telefon, email"
				/>
				<meta name="author" content="Restauracja Spoko" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>

			<MainContainer className="pt-20 pb-8">
				<MaxWidthWrapper>
					<PageHeaderContainer
						description="Skontaktuj się z nami, aby uzyskać więcej informacji lub zarezerwować stolik. Nasz zespół jest gotowy do odpowiedzi na wszystkie Twoje pytania."
						title="Kontakt"
						image="/img/contact-page.jpg"
						imageMobile="/img/contact-page-mobile.jpg"
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 h-full">
						<div className="space-y-6 justify-self-center content-center">
							<div>
								<h2 className="text-2xl font-bold text-secondary">Skontaktuj się z nami:</h2>
								<p className="text-lg">Telefon: <a href="tel:+48530659666" className="text-primary">+48 530 659 666</a></p>
								<p className="text-lg">Email: <a href="mailto:info@spokosopot.pl" className="text-primary">info@spokosopot.pl</a></p>
								<p className="text-lg">Adres: Hestii 3, 81-731 Sopot</p>
							</div>
							<div>
								<h2 className="text-2xl font-bold text-secondary">Godziny otwarcia</h2>
								<p>Poniedziałek - Piątek: 10:00 - 19:00</p>
								<p>Sobota - Niedziela: 8:00 - 19:00</p>
							</div>
						</div>

						{/* Права колонка: Фото менеджера */}
						<div className="hidden md:flex md:relative h-full w-full rounded-md overflow-hidden md:col-span-1 aspect-square">
							<Image
								src="/img/manager.jpg"
								alt="Manager"
								fill
								className="object-cover w-full h-full"
							/>
						</div>
					</div>

					{/* Блок з картою та формою */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
						{/* Ліва колонка: Карта */}
						<div className="relative w-full aspect-square rounded-md overflow-hidden">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.356080609364!2d18.58294595188907!3d54.43213053637157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd0b6edee7521f%3A0x324a244fefc976ef!2sRestauracja%20Spoko%20Sopot!5e0!3m2!1suk!2spl!4v1721160082108!5m2!1suk!2spl"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="object-cover w-full h-full"
							></iframe>
						</div>

						{/* Права колонка: Форма контакту */}
						<div className="space-y-6 justify-self-center content-center w-full">
							<h2 className="text-2xl font-bold text-secondary text-center">Wypełnij formularz, aby skontaktować się z nami. Chętnie odpowiemy na Twoje pytania lub przyjmiemy rezerwację.
							</h2>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Twoje imię</FormLabel>
												<FormControl>
													<Input placeholder="Twoje imię" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Twój email</FormLabel>
												<FormControl>
													<Input type="email" placeholder="Twój email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="message"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Twoja wiadomość</FormLabel>
												<FormControl>
													<Textarea placeholder="Twoja wiadomość" rows={6} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="consent"
										render={({ field }) => (
											<FormItem className="flex flex-col items-start space-y-2">
												<div className="flex items-start space-x-2">
													<FormControl>
														<Checkbox checked={field.value} onCheckedChange={field.onChange} />
													</FormControl>
													<FormLabel className="text-sm font-normal text-muted-foreground">
														Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
														<Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline text-primary">
															polityką prywatności
														</Link>
													</FormLabel>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
										{form.formState.isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</MaxWidthWrapper>
			</MainContainer>
		</>
	)
}

export default ContactPage
