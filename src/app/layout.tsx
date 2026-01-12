import './globals.css'
import type { Metadata } from 'next'
import { Lato, Mulish } from 'next/font/google'

const lato = Lato({ 
  weight: ['400', '700', '900'], 
  subsets: ['latin'],
  variable: '--font-lato'
})

const mulish = Mulish({ 
  weight: '800', 
  subsets: ['latin'],
  variable: '--font-mulish'
})

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
      <body className={`${lato.variable} ${mulish.variable} ${lato.className}`}>
        {children}
      </body>
    </html>
  )
}
