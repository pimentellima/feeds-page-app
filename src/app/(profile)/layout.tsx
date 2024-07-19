import { auth } from '@/lib/auth'
import NextThemesProvider from '../next-themes-provider'
import { getUser } from '@/services/user'
import { redirect } from 'next/navigation'

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()

    if (!session?.user) redirect('/sign-in')

    const defaultTheme = (await getUser(session.user.id))?.theme ?? 'undefined'

    return (
        <NextThemesProvider attribute='class' forcedTheme={defaultTheme}>
            {children}
        </NextThemesProvider>
    )
}
