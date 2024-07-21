'use client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { themes } from '@/constants'
import { PaletteIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ChangeThemeDropdown() {
    const { setTheme, theme } = useTheme()

    const handleChangeTheme = async (theme: string) => {
        const themeIndex = themes.findIndex((t) => t.name === theme)
        if (themeIndex === -1) {
            return 'Theme not found'
        }
        setTheme(theme)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <PaletteIcon className="mr-1 h-4 w-4" />
                    <span>Change theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(theme) => handleChangeTheme(theme)}
                >
                    {themes.map(({ gradient, label, name }) => (
                        <DropdownMenuRadioItem
                            key={name}
                            value={name}
                            className="flex items-center"
                        >
                            <div
                                style={{ backgroundColor: gradient }}
                                className="rounded-full h-4 w-4 mr-2"
                            />
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
