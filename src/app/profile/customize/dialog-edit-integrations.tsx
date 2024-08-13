'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { integrationTokens } from '@/drizzle/schema'
import { DialogDescription, DialogTrigger } from '@radix-ui/react-dialog'
import { InferSelectModel } from 'drizzle-orm'
import { useState } from 'react'
import { SocialLinkIcon } from '../../../components/social-icons'
import { deleteIntegration } from './actions'
import { LinkIcon } from 'lucide-react'
import ButtonConnectAccount from './button-connect-account'

export default function DialogEditIntegrations({
    integrations = [],
    trigger
}: {
    integrations: InferSelectModel<typeof integrationTokens>[]
    trigger?: React.ReactNode
}) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    function findIntegration(
        type: InferSelectModel<typeof integrationTokens>['type']
    ) {
        return integrations.find((i) => i.type === type)
    }

    const onClickDeleteIntegration = async (integrationId: string) => {
        const error = await deleteIntegration(integrationId)
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

    const instagramIntegration = findIntegration('instagramIntegration')
    const tiktokIntegration = findIntegration('tiktokIntegration')
    const pinterestIntegration = findIntegration('pinterestIntegration')
    const spotifyIntegration = findIntegration('spotifyIntegration')
    const youtubeIntegration = findIntegration('youtubeIntegration')

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost">
                        <LinkIcon className="mr-0 sm:mr-1 h-4 w-4" />
                        <span className='hidden sm:block'>Integrations</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage integrations</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add or revoke access to your integrations.
                </DialogDescription>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <SocialLinkIcon linkType="instagram" />
                        Instagram
                    </div>
                    {instagramIntegration ? (
                        <Button
                            onClick={() =>
                                onClickDeleteIntegration(
                                    instagramIntegration.id
                                )
                            }
                            variant="destructive"
                        >
                            <span>Revoke access</span>
                        </Button>
                    ) : (
                        <ButtonConnectAccount
                            label={'Connect account'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                        />
                    )}
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <SocialLinkIcon linkType="tiktok" />
                        Tiktok
                    </div>
                    {tiktokIntegration ? (
                        <Button
                            onClick={() =>
                                onClickDeleteIntegration(tiktokIntegration.id)
                            }
                            variant="destructive"
                        >
                            <span>Revoke access</span>
                        </Button>
                    ) : (
                        <ButtonConnectAccount
                            label={'Connect account'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/tiktok'}
                        />
                    )}
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <SocialLinkIcon linkType="pinterest" />
                        Pinterest
                    </div>
                    {pinterestIntegration ? (
                        <Button
                            onClick={() =>
                                onClickDeleteIntegration(
                                    pinterestIntegration.id
                                )
                            }
                            variant="destructive"
                        >
                            <span>Revoke access</span>
                        </Button>
                    ) : (
                        <ButtonConnectAccount
                            label={'Connect account'}
                            url={
                                process.env.NEXT_PUBLIC_URL! + '/api/pinterest'
                            }
                        />
                    )}
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <SocialLinkIcon linkType="youtube" />
                        Youtube
                    </div>
                    {youtubeIntegration ? (
                        <Button
                            onClick={() =>
                                onClickDeleteIntegration(youtubeIntegration.id)
                            }
                            variant="destructive"
                        >
                            <span>Revoke access</span>
                        </Button>
                    ) : (
                        <ButtonConnectAccount
                            label={'Connect account'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/youtube'}
                        />
                    )}
                </div>

                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <SocialLinkIcon linkType="spotify" />
                        Spotify
                    </div>
                    {spotifyIntegration ? (
                        <Button
                            onClick={() =>
                                onClickDeleteIntegration(spotifyIntegration.id)
                            }
                            variant="destructive"
                        >
                            <span>Revoke access</span>
                        </Button>
                    ) : (
                        <ButtonConnectAccount
                            label={'Connect account'}
                            url={process.env.NEXT_PUBLIC_URL! + '/api/spotify'}
                        />
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
