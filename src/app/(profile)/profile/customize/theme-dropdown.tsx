'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { themes } from '@/constants'
import { updateUserTheme } from './actions'

export function ThemeDropdown() {
    const { setTheme, theme, forcedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    console.log(forcedTheme)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    const themeToGradient = (theme: string | undefined) => {
        return themes.find((t) => t.name === theme)?.gradient || '#536976'
    }

    const themeToLabel = (theme: string | undefined) => {
        return themes.find((t) => t.name === theme)?.label || 'Default'
    }

    const handleChangeTheme = async (theme: string) => {
        const themeIndex = themes.findIndex((t) => t.name === theme)
        if (themeIndex === -1) {
            return 'Theme not found'
        }
        setTheme(theme)
        await updateUserTheme(theme)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'outline'} className=" flex gap-2">
                    <div
                        style={{ backgroundColor: themeToGradient(theme) }}
                        className="rounded-full h-5 w-5"
                    />
                    {themeToLabel(theme)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map(({ gradient, label, name }) => (
                    <DropdownMenuItem
                        key={name}
                        className="flex gap-2"
                        onClick={() => handleChangeTheme(name)}
                    >
                        <div
                            style={{ backgroundColor: gradient }}
                            className="rounded-full h-5 w-5"
                        />
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
