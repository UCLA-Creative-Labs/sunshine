import './globals.css'
import type { Metadata } from 'next'
import { Inter, Texturina, DM_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const texturina = Texturina({
  weight: ['400', '700'],
  style: ['italic', 'normal'],
  subsets: ['latin'],
  variable: '--font-texturina',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
})

/*
 * DIN Condensed family is declared as @font-face in globals.css under the
 * name 'CL Display' (weight 400 = Oswald proxy, weight 700 = DIN Bold .ttf).
 * next/font/local multi-src hits a Turbopack bug in Next 16.1 so we hand-roll
 * the @font-face. See globals.css + TOKENS.md.
 */

export const metadata: Metadata = {
  title: 'Creative Labs at UCLA',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={`${inter.variable} ${texturina.variable} ${dmMono.variable} ${inter.className}`}
      >
        {children}
      </body>
    </html>
  )
}
