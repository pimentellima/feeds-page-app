'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    InstagramIcon,
    LinkIcon,
    PlusIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import { useState } from 'react'
import AddLinkForm from './add-link-form'
import { Button } from '@/components/ui/button'
import TiktokIcon from '@/components/tiktok-icon'
import { addIntegration } from './actions'
import { useToast } from '@/components/ui/use-toast'
import SpotifyIcon from '@/components/spotify-icon'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export function AddWidgetPopover() {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const { toast } = useToast()

    const onClickIntegration = async (
        value: 'youtube' | 'instagram' | 'x' | 'tiktok'
    ) => {
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
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'secondary'}>
                        <PlusIcon className="h-5 w-5" />
                        Add item
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <button
                            onClick={() => setLinkDialogOpen(true)}
                            className="flex gap-2 items-center w-full"
                        >
                            <LinkIcon className="h-5 w-5" />
                            Custom link
                        </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => onClickIntegration('youtube')}
                        className="flex gap-2 items-center"
                    >
                        <YoutubeIcon className="text-red-500 w-5 h-5" />
                        Youtube videos
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onClickIntegration('instagram')}
                        className="flex gap-2 items-center"
                    >
                        <InstagramIcon className="text-pink-500 h-5 w-5" />
                        Instagram media
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onClickIntegration('tiktok')}
                        className="flex gap-2 items-center"
                    >
                        <TiktokIcon className="fill-foreground h-5 w-5" />
                        Tiktok media
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled
                        className="flex gap-2 items-center"
                    >
                        <SpotifyIcon className="fill-green-400 h-5 w-5" />
                        Spotify activity (Coming soon)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled
                        className="flex gap-2 items-center"
                    >
                        <XIcon className="text-foreground h-5 w-5" />X posts
                        (Coming soon)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog
                open={linkDialogOpen}
                onOpenChange={(open) => setLinkDialogOpen(open)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add social link</DialogTitle>
                    </DialogHeader>
                    <AddLinkForm
                        onCancelForm={() => setLinkDialogOpen(false)}
                        onSubmitForm={() => setLinkDialogOpen(true)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}
