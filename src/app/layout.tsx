import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import Providers from './profile/customize/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Feeds Page',
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
            </body>
        </html>
    )
}
