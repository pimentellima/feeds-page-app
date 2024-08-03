'use client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { themes } from '@/constants'
import { PaletteIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { updateUserTheme } from './actions'

export default function ChangeThemeDropdown() {
    const { forcedTheme } = useTheme()
    const { toast } = useToast()

    const handleChangeTheme = async (newTheme: string) => {
        const themeIndex = themes.findIndex((t) => t.name === newTheme)
        if (themeIndex === -1) return

        const error = await updateUserTheme(newTheme)
        if (error) {
            toast({
                title: 'Error updating theme',
                variant: 'destructive',
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <PaletteIcon className="mr-1 h-4 w-4" />
                    <span>Theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
                <DropdownMenuRadioGroup
                    value={forcedTheme}
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
