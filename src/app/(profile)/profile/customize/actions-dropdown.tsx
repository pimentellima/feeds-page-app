'use client'
import SpotifyIcon from '@/components/spotify-icon'
import TiktokIcon from '@/components/tiktok-icon'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { widgets } from '@/drizzle/schema'
import { InferInsertModel } from 'drizzle-orm'
import {
    CheckIcon,
    CreditCard,
    ImageIcon,
    InstagramIcon,
    LayoutPanelTop,
    LinkIcon,
    LogOut,
    Palette,
    PaletteIcon,
    PlusIcon,
    Settings,
    User,
    UserPlus,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import { useState } from 'react'
import { addIntegration, updateUserTheme } from './actions'
import AddLinkForm from './add-link-form'
import { themes } from '@/constants'
import { useTheme } from 'next-themes'
import { signOut } from 'next-auth/react'

type IntegrationType = InferInsertModel<typeof widgets>['type'] | ''

export function ActionsDropdown() {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuLabel>Customization</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <LayoutPanelTop className="mr-2 h-4 w-4" />
                                <span>Add widget</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onClick={() => setLinkDialogOpen(true)}
                                    >
                                        <LinkIcon className="mr-2 h-4 w-4" />
                                        Custom link
                                    </DropdownMenuItem>
                                    <AddIntegrationMenuItem value="youtubeIntegration">
                                        <YoutubeIcon className="mr-2 text-red-500 w-4 h-4" />
                                        Youtube videos
                                    </AddIntegrationMenuItem>
                                    <AddIntegrationMenuItem value="instagramIntegration">
                                        <InstagramIcon className="mr-2 text-pink-500 h-4 w-4" />
                                        Instagram media
                                    </AddIntegrationMenuItem>
                                    <AddIntegrationMenuItem value="tiktokIntegration">
                                        <TiktokIcon className="mr-2 fill-foreground h-4 w-4" />
                                        Tiktok media
                                    </AddIntegrationMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <PaletteIcon className="mr-2 h-4 w-4" />
                                <span>Set theme</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {themes.map((theme) => (
                                        <ThemeMenuItem
                                            key={theme.name}
                                            themeGradient={theme.gradient}
                                            themeLabel={theme.label}
                                            themeName={theme.name}
                                        />
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                key="add-link-dialog"
                open={linkDialogOpen}
                onOpenChange={(open) => setLinkDialogOpen(open)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add social link</DialogTitle>
                    </DialogHeader>
                    <AddLinkForm
                        onCancelForm={() => setLinkDialogOpen(false)}
                        onSubmitForm={() => setLinkDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

function ThemeMenuItem({
    themeName,
    themeLabel,
    themeGradient,
}: {
    themeName: string
    themeLabel: string
    themeGradient: string
}) {
    const { setTheme, theme, forcedTheme } = useTheme()

    const handleChangeTheme = async (theme: string) => {
        const themeIndex = themes.findIndex((t) => t.name === theme)
        if (themeIndex === -1) {
            return 'Theme not found'
        }
        setTheme(theme)
        await updateUserTheme(theme)
    }

    const isSelected = themeName === theme

    return (
        <DropdownMenuItem
            className="flex gap-2"
            onClick={() => handleChangeTheme(themeName)}
        >
            <div
                style={{ backgroundColor: themeGradient }}
                className="rounded-full h-5 w-5"
            />
            {themeLabel}
            {isSelected && <CheckIcon className="h-4 w-4" />}
        </DropdownMenuItem>
    )
}

function AddIntegrationMenuItem({
    children,
    value,
}: {
    children: React.ReactNode
    value: IntegrationType
}) {
    const { toast } = useToast()

    const handleAddIntegration = async () => {
        if (!value) return
        const error = await addIntegration(value)
        if (error) {
            toast({
                title: 'An error occurred',
                description: error,
                variant: 'destructive',
            })
            return
        }
    }

    return (
        <DropdownMenuItem onClick={handleAddIntegration}>
            {children}
        </DropdownMenuItem>
    )
}
