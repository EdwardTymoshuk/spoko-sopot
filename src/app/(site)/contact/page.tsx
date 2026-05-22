'use client'

import MainContainer from '@/app/components/MainContainer'
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper'
import PageHeaderContainer from '@/app/components/PageHeaderComponent'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { FiClock, FiMail, FiMapPin, FiPhoneCall, FiSend } from 'react-icons/fi'
import { toast } from 'sonner'
import { z } from 'zod'

const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Proszę podać imię')
    .refine((value) => value.length >= 2, {
      message: 'Imię musi zawierać przynajmniej 2 znaki',
    }),

  email: z
    .string()
    .min(1, 'Proszę podać email')
    .email('Podaj prawidłowy adres email'),

  message: z
    .string()
    .min(1, 'Proszę wpisać wiadomość')
    .refine((value) => value.length >= 10, {
      message: 'Wiadomość musi zawierać przynajmniej 10 znaków',
    }),

  consent: z.boolean().refine((value) => value === true, {
    message: 'Proszę wyrazić zgodę na przetwarzanie danych',
  }),
})

type ContactFormData = z.infer<typeof contactFormSchema>

const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.356080609364!2d18.58294595188907!3d54.43213053637157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd0b6edee7521f%3A0x324a244fefc976ef!2sRestauracja%20Spoko%20Sopot!5e0!3m2!1suk!2spl!4v1721160082108!5m2!1suk!2spl'

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
    <MainContainer className="pt-14 pb-24">
      <PageHeaderContainer
        description="Zadzwoń, napisz albo odwiedź nas przy plaży. Odpowiemy na pytania o rezerwacje, przyjęcia i aktualną dostępność stolików."
        title="Kontakt"
        image="/img/contact-page.jpg"
        imageMobile="/img/contact-page-mobile.jpg"
      />

      <MaxWidthWrapper className="space-y-16 py-12 md:space-y-20 md:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Hestii 3, Sopot
            </p>

            <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
              Napisz do nas albo wpadnij do Spoko
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Jesteśmy tuż przy plaży, w spokojnej części Sopotu. Skontaktuj
              się z nami w sprawie stolika, przyjęcia, oferty grupowej albo
              szczegółów wizyty.
            </p>

            <div className="mt-8 grid gap-x-10 gap-y-6 text-sm text-zinc-600 sm:grid-cols-2">
              <a
                href="tel:+48530659666"
                className="border-l border-primary/45 pl-4 transition-colors hover:text-secondary"
              >
                <p className="flex items-center gap-2 font-semibold text-secondary">
                  <FiPhoneCall className="text-primary" />
                  Telefon
                </p>
                <p className="mt-1">530 659 666</p>
              </a>

              <a
                href="mailto:info@spokosopot.pl"
                className="border-l border-primary/45 pl-4 transition-colors hover:text-secondary"
              >
                <p className="flex items-center gap-2 font-semibold text-secondary">
                  <FiMail className="text-primary" />
                  Email
                </p>
                <p className="mt-1">info@spokosopot.pl</p>
              </a>

              <div className="border-l border-primary/45 pl-4">
                <p className="flex items-center gap-2 font-semibold text-secondary">
                  <FiMapPin className="text-primary" />
                  Adres
                </p>
                <p className="mt-1">Hestii 3, 81-731 Sopot</p>
              </div>

              <div className="border-l border-primary/45 pl-4">
                <p className="flex items-center gap-2 font-semibold text-secondary">
                  <FiClock className="text-primary" />
                  Godziny
                </p>
                <p className="mt-1">Pon-pt: 10:00 - 19:00</p>
                <p>Sob-niedz: 8:00 - 19:00</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm sm:aspect-[16/10] lg:aspect-[4/5]">
            <Image
              src="/img/manager.jpg"
              alt="Zespół restauracji Spoko"
              fill
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <div className="flex w-full justify-center">
          <div className="h-px w-40 bg-[#ded8cc] sm:w-72 md:w-full md:max-w-4xl" />
        </div>

        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Formularz
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
                Zostaw wiadomość
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg">
                Opisz krótko, czego dotyczy kontakt. Jeśli pytasz o rezerwację
                lub przyjęcie, dopisz datę, liczbę osób i preferowaną godzinę.
              </p>
            </div>

            <div className="rounded-lg border border-[#ded8cc] bg-white/55 p-5 text-sm leading-relaxed text-zinc-500">
              W sprawach pilnych najlepiej zadzwonić. Formularz sprawdzi się do
              pytań o ofertę, przyjęcia, współpracę i szczegóły organizacyjne.
            </div>
          </div>

          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                        <Input
                          type="email"
                          placeholder="Twój email"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="Twoja wiadomość"
                          rows={6}
                          {...field}
                        />
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
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal text-muted-foreground">
                          Wyrażam zgodę na przetwarzanie moich danych osobowych
                          zgodnie z{' '}
                          <Link
                            href="/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            polityką prywatności
                          </Link>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="h-12 w-full gap-2.5 rounded-lg bg-secondary font-semibold text-white shadow-none hover:bg-secondary/90"
                  disabled={form.formState.isSubmitting}
                >
                  <FiSend className="h-4 w-4" />
                  {form.formState.isSubmitting
                    ? 'Wysyłanie...'
                    : 'Wyślij wiadomość'}
                </Button>
              </form>
            </Form>
          </div>
        </section>

        <div className="flex w-full justify-center">
          <div className="h-px w-40 bg-[#ded8cc] sm:w-72 md:w-full md:max-w-4xl" />
        </div>

        <section className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Dojazd
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-secondary md:text-5xl">
              Znajdziesz nas blisko plaży
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg">
              Restauracja znajduje się przy Hestii 3, kilka kroków od morza. W
              sezonie warto zaplanować chwilę więcej na dojazd i parkowanie.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="460"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Restauracji Spoko Sopot"
            ></iframe>
          </div>
        </section>
      </MaxWidthWrapper>
    </MainContainer>
  )
}

export default ContactPage
