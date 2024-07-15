'use client'

import { themes } from '@/constants'
import { ThemeProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

export default function NextThemesProvider({
    children,
    ...props
}: Omit<ThemeProviderProps, 'themes'>) {
    const themeOptions = themes.map(({ name }) => name)

    return (
        <ThemeProvider {...props} themes={themeOptions}>
            {children}
        </ThemeProvider>
    )
}
