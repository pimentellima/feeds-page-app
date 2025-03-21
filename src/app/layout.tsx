import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Feed Page',
    description: 'Aggregate your social media updates in one place.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html suppressHydrationWarning lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" />
            </head>
            <body className={inter.className}>
                <Providers>{children}</Providers>
                <Toaster />
                <Analytics />
            </body>
        </html>
    )
}
