import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TimeBack - School Is Broken. We Fixed It.',
  description: 'Our students score in the 99th percentile nationally. AI tutors give 100% attention 100% of the time. Kids learn 2.47x faster in just 2 hours a day.',
  keywords: 'AI education, personalized learning, 2 sigma, Bloom, Alpha School, TimeBack, homeschool alternative, 99th percentile',
  openGraph: {
    title: 'TimeBack - School Is Broken. We Fixed It.',
    description: 'Our students score in the 99th percentile nationally. Kids learn 2.47x faster with AI tutors.',
    url: 'https://timeback.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeBack - School Is Broken. We Fixed It.',
    description: 'Our students score in the 99th percentile nationally. Kids learn 2.47x faster with AI tutors.',
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
