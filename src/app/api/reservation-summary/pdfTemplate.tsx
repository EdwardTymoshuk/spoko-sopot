import { existsSync, readFileSync } from 'fs'
import path from 'path'
import React from 'react'
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from '@react-pdf/renderer'

type SummaryItem = { label: string; value: string }
type SummarySection = { title: string; items: SummaryItem[] }

let fontsRegistered = false
let activeFontFamily = 'Helvetica'

const registerFonts = () => {
  if (fontsRegistered) return

  const regularCandidates = [
    process.env.PDF_FONT_REGULAR_PATH?.trim() || '',
    path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf'),
    path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Regular.ttf'),
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/dejavu/DejaVuSans.ttf',
    '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
    '/System/Library/Fonts/Supplemental/Arial.ttf',
  ].filter(Boolean)

  const boldCandidates = [
    process.env.PDF_FONT_BOLD_PATH?.trim() || '',
    path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans-Bold.ttf'),
    path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Bold.ttf'),
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf',
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
  ].filter(Boolean)

  const regularSrc = regularCandidates.find((candidate) => existsSync(candidate))
  const boldSrc = boldCandidates.find((candidate) => existsSync(candidate))

  if (regularSrc) {
    const regularFontBase64 = readFileSync(regularSrc).toString('base64')
    const regularFontSrc = `data:font/ttf;base64,${regularFontBase64}`
    Font.register({
      family: 'SpokoSans',
      src: regularFontSrc,
      fontStyle: 'normal',
      fontWeight: 'normal',
    })
    activeFontFamily = 'SpokoSans'
    if (boldSrc) {
      const boldFontBase64 = readFileSync(boldSrc).toString('base64')
      const boldFontSrc = `data:font/ttf;base64,${boldFontBase64}`
      Font.register({
        family: 'SpokoSans',
        src: boldFontSrc,
        fontStyle: 'normal',
        fontWeight: 'bold',
      })
    }
  }

  fontsRegistered = true
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 44,
    backgroundColor: '#ffffff',
    color: '#111827',
    fontFamily: 'SpokoSans',
    fontSize: 10,
  },
  topAccent: {
    height: 4,
    backgroundColor: '#A8C34B',
    borderRadius: 999,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleWrap: {
    flexDirection: 'column',
    gap: 4,
    maxWidth: '75%',
  },
  subtitle: {
    fontSize: 10,
    color: '#5E6B3A',
    fontWeight: 'bold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 1.2,
  },
  generatedAt: {
    marginTop: 2,
    fontSize: 9,
    color: '#6B7280',
  },
  logo: {
    width: 78,
    height: 38,
    objectFit: 'contain',
  },
  section: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 7,
    color: '#111827',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    columnGap: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF3',
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1F2937',
    width: '58%',
    lineHeight: 1.28,
  },
  itemValue: {
    fontSize: 10,
    color: '#0F172A',
    width: '42%',
    lineHeight: 1.28,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalWrap: {
    marginTop: 14,
    borderTopWidth: 2,
    borderTopColor: '#A8C34B',
    paddingTop: 8,
  },
  total: {
    fontSize: 14,
    color: '#2E4D0D',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 18,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    fontSize: 8.5,
    color: '#6B7280',
    lineHeight: 1.4,
  },
})

const sanitize = (value: string) =>
  value
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()

const cleanLabel = (value: string) =>
  sanitize(value)
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .trim()

const ReservationSummaryPdf = ({
  sections,
  total,
  logoDataUrl,
  fontFamily,
}: {
  sections: SummarySection[]
  total: number
  logoDataUrl?: string
  fontFamily: string
}) => (
  <Document>
    <Page size="A4" style={[styles.page, { fontFamily }]}>
      <View style={styles.topAccent} />

      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.subtitle}>Podsumowanie oferty</Text>
          <Text style={styles.title}>Restauracja Spoko Sopot</Text>
          <Text style={styles.generatedAt}>
            Data wygenerowania: {new Date().toLocaleString('pl-PL')}
          </Text>
        </View>
        {logoDataUrl ? <Image style={styles.logo} src={logoDataUrl} alt="" /> : null}
      </View>

      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{sanitize(section.title)}</Text>
          {section.items.map((item, index) => (
            <View key={`${section.title}-${item.label}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemLabel}>{cleanLabel(item.label)}:</Text>
              <Text style={styles.itemValue}>{sanitize(item.value)}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.totalWrap}>
        <Text style={styles.total}>Suma orientacyjna: {total} zł</Text>
      </View>

      <Text style={styles.footer}>
        Restauracja Spoko Sopot | tel. +48 530 659 666 | info@spokosopot.pl
      </Text>
    </Page>
  </Document>
)

export const generateReservationSummaryPdf = async (
  sections: SummarySection[],
  total: number
) => {
  registerFonts()

  let logoSrc: string | undefined
  const logoPath = path.join(process.cwd(), 'public', 'img', 'logo-spoko-2.png')
  if (existsSync(logoPath)) {
    const logoBase64 = readFileSync(logoPath).toString('base64')
    logoSrc = `data:image/png;base64,${logoBase64}`
  }

  return renderToBuffer(
    <ReservationSummaryPdf
      sections={sections}
      total={total}
      logoDataUrl={logoSrc}
      fontFamily={activeFontFamily}
    />
  )
}
