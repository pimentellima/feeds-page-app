'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { integrationTokens } from '@/drizzle/schema'
import { InferSelectModel } from 'drizzle-orm'
import { useActionState, useState } from 'react'
import { deleteIntegration } from './actions'
import InstagramIcon from '@/components/instagram-icon'
import TiktokIcon from '@/components/tiktok-icon'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    CircleUserIcon,
    LineChartIcon,
    LinkIcon,
    LogOut,
    SparklesIcon,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useFormStatus } from 'react-dom'
import { SocialLinkIcon } from './social-icons'

export function AccountSettingsDropdown({
    integrations,
}: {
    integrations: InferSelectModel<typeof integrationTokens>[]
}) {
    const [integrationDialogOpen, setIntegrationDialogOpen] =
        useState<boolean>(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <CircleUserIcon className="mr-1 h-4 w-4" /> Account
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <LineChartIcon className="mr-2 h-4 w-4" />
                            <span>Check metrics</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <SparklesIcon className="mr-2 h-4 w-4" />
                            <span>Upgrade plan</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setIntegrationDialogOpen(true)}
                        >
                            <LinkIcon className="mr-2 h-4 w-4" />
                            <span>Manage integrations</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteIntegrationDialog
                integrations={integrations}
                open={integrationDialogOpen}
                setOpen={(open) => setIntegrationDialogOpen(open)}
            />
        </>
    )
}

function DeleteIntegrationDialog({
    integrations = [],
    open,
    setOpen,
}: {
    integrations?: InferSelectModel<typeof integrationTokens>[]
    open: boolean
    setOpen: (open: boolean) => void
}) {
    const { toast } = useToast()

    const onClickDeleteIntegration = async (integrationid: string) => {
        const error = await deleteIntegration(integrationid)
        if (error) {
            toast({
                title: 'Error deleting integration',
                description: error,
                variant: 'destructive',
            })
            return
        }
        toast({
            title: 'Integration deleted succesfully',
        })
    }

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage integrations</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Revoke access to your current integrations.
                </DialogDescription>
                <div>
                    {integrations.length == 0 ? (
                        <span>No integrations</span>
                    ) : (
                        integrations.map((integration) => {
                            if (integration.type === 'instagramIntegration')
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={integration.id}
                                    >
                                        <div className="flex items-center gap-1">
                                            <SocialLinkIcon linkType="instagram" />
                                            Instagram
                                        </div>
                                        <Button
                                            onClick={() =>
                                                onClickDeleteIntegration(
                                                    integration.id
                                                )
                                            }
                                            variant="ghost"
                                        >
                                            <span>Revoke access</span>
                                        </Button>
                                    </div>
                                )
                            if (integration.type === 'tiktokIntegration')
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={integration.id}
                                    >
                                        <div className="flex items-center gap-1">
                                            <SocialLinkIcon linkType="tiktok" />
                                            Tiktok
                                        </div>
                                        <Button
                                            onClick={() =>
                                                onClickDeleteIntegration(
                                                    integration.id
                                                )
                                            }
                                            variant="ghost"
                                        >
                                            <span>Revoke access</span>
                                        </Button>
                                    </div>
                                )
                            if (integration.type === 'pinterestIntegration')
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={integration.id}
                                    >
                                        <div className="flex items-center gap-1">
                                            <SocialLinkIcon linkType="pinterest" />
                                            Pinterest
                                        </div>
                                        <Button
                                            onClick={() =>
                                                onClickDeleteIntegration(
                                                    integration.id
                                                )
                                            }
                                            variant="ghost"
                                        >
                                            <span>Revoke access</span>
                                        </Button>
                                    </div>
                                )
                            if (integration.type === 'spotifyIntegration')
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={integration.id}
                                    >
                                        <div className="flex items-center gap-1">
                                            <SocialLinkIcon linkType="spotify" />
                                            Spotify
                                        </div>
                                        <Button
                                            onClick={() =>
                                                onClickDeleteIntegration(
                                                    integration.id
                                                )
                                            }
                                            variant="ghost"
                                        >
                                            <span>Revoke access</span>
                                        </Button>
                                    </div>
                                )
                            if (integration.type === 'youtubeIntegration')
                                return (
                                    <div
                                        className="flex justify-between"
                                        key={integration.id}
                                    >
                                        <div className="flex items-center gap-1">
                                            <SocialLinkIcon linkType="youtube" />
                                            Youtube
                                        </div>
                                        <Button
                                            onClick={() =>
                                                onClickDeleteIntegration(
                                                    integration.id
                                                )
                                            }
                                            variant="ghost"
                                        >
                                            <span>Revoke access</span>
                                        </Button>
                                    </div>
                                )
                        })
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
