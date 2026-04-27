import './globals.css'
import type { Metadata } from 'next'
import {
  Inter,
  Texturina,
  DM_Mono,
  Lato,
  Mulish,
  Archivo_Black,
} from 'next/font/google'

// Portal font stack (post 2026-04-22 Figma pivot)
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

// Public-site font stack (kept alongside portal fonts so public-site
// components that reference --font-lato / --font-mulish / --font-archivo-black
// continue to resolve. Dropped from portal per TOKENS.md but non-portal
// surfaces (Navbar, JoinContent, login/signup, GenericCard, ProjectCard,
// UpcomingEventsCard) still rely on them.)
const lato = Lato({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

const mulish = Mulish({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-mulish',
  display: 'swap',
})

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
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
        className={`${inter.variable} ${texturina.variable} ${dmMono.variable} ${lato.variable} ${mulish.variable} ${archivoBlack.variable} ${lato.className}`}
      >
        {children}
      </body>
    </html>
  )
}
