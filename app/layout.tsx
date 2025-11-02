import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Precise Pattern Maker Agent',
  description: 'AI-powered pattern generation tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
