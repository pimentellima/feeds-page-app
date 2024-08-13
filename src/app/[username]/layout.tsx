import { getUser, getUserByUsername } from '@/services/user'
import NextThemesProvider from '../next-themes-provider'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { username: string }
}) {
    if (params.username === 'preview') {
        const session = await auth()
        if (!session) {
            return redirect('/sign-in')
        }
        const theme = (await getUser(session.user.id))?.theme || 'default'

        return (
            <NextThemesProvider attribute="class" forcedTheme={theme}>
                {children}
            </NextThemesProvider>
        )
    }
    const userTheme = (await getUserByUsername(params.username)).theme

    return (
        <NextThemesProvider
            attribute="class"
            forcedTheme={userTheme || 'default'}
        >
            {children}
        </NextThemesProvider>
    )
}
