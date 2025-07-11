import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TimeBack - Kids Learn 2x More in 2 Hours a Day',
  description: 'AI tutors give every student personal attention. Real kids scoring in the 99th percentile. Start a school or find one near you.',
  keywords: 'AI education, personalized learning, 2 sigma, Bloom, Alpha School, TimeBack, homeschool alternative',
  openGraph: {
    title: 'TimeBack - Kids Learn 2x More in 2 Hours a Day',
    description: 'AI tutors give every student personal attention. Real kids scoring in the 99th percentile.',
    url: 'https://timeback.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeBack - Kids Learn 2x More in 2 Hours a Day',
    description: 'AI tutors give every student personal attention. Real kids scoring in the 99th percentile.',
  },
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
