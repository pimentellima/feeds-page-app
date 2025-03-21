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

export default function DropdownEditPageTheme({
    trigger,
}: {
    trigger?: React.ReactNode
}) {
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
                {trigger || (
                    <Button size={'sm'} variant="ghost">
                        <PaletteIcon className="mr-1 h-4 w-4" />
                        <span className="text-xs sm:text-sm">Theme</span>
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
                <DropdownMenuRadioGroup
                    className="grid grid-cols-2"
                    value={forcedTheme}
                    onValueChange={(theme) => handleChangeTheme(theme)}
                >
                    {themes.map(({ gradient, name }) => (
                        <DropdownMenuRadioItem key={name} value={name}>
                            <div
                                style={{ backgroundColor: gradient }}
                                className="rounded-full h-4 w-4 ring-1 ring-secondary"
                            />
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
