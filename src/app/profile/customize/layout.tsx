import { auth } from '@/lib/auth'
import { getUser } from '@/services/user'
import { redirect } from 'next/navigation'
import NextThemesProvider from '../../next-themes-provider'
import Providers from './providers'

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()

    if (!session?.user) redirect('/sign-in')

    const theme = (await getUser(session.user.id))?.theme ?? 'default'

    return (
        <NextThemesProvider attribute="class" forcedTheme={theme}>
            <Providers>{children}</Providers>
        </NextThemesProvider>
    )
}
