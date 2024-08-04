import { getUserByUsername } from '@/services/user'
import NextThemesProvider from '../next-themes-provider'

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { username: string }
}) {
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
