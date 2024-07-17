import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { accountLinks, users } from '@/drizzle/schema'
import { getInstagramProfileAndMedia } from '@/lib/api-helpers/instagram'
import { refreshAccountLinkAccessToken } from '@/services/accountLinks'
import { formatDistanceToNow } from 'date-fns'
import { InferSelectModel } from 'drizzle-orm'
import {
    InstagramIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import DeleteIntegrationPopover from './delete-integration-popover'
import PairAccountButton from './pair-account-button'

export default async function InstagramWidget({
    user,
}: {
    user: InferSelectModel<typeof users> & {
        accountLinks: InferSelectModel<typeof accountLinks>[]
    }
}) {
    const accountLink = user.accountLinks.find(
        (link) => link.type === 'instagram'
    )

    if (!accountLink) return null

    if (!accountLink.accessToken)
        return (
            <div
                className="rounded-md bg-card text-card-foreground text-sm
                tracking-tight leading-none border p-3
                flex flex-col items-center justify-center gap-4"
            >
                <div className="flex justify-between w-full">
                    <div />
                    <div className="flex gap-2 items-center">
                        <InstagramIcon className="text-pink-500 w-4 h-4" />
                        <p>Instagram Feed</p>
                    </div>
                    <DeleteIntegrationPopover id={accountLink.id} />
                </div>
                <PairAccountButton
                    label="Click to pair your Instagram account"
                    link={process.env.NEXT_PUBLIC_URL! + '/api/ig'}
                />
            </div>
        )

    const accessToken =
        accountLink.expiresAt && new Date() > accountLink.expiresAt
            ? (await refreshAccountLinkAccessToken(accountLink))?.accessToken
            : accountLink.accessToken

    if (!accessToken)
        return (
            <div
                className="rounded-md bg-card text-card-foreground text-sm
                    tracking-tight leading-none border p-3
                    flex flex-col items-center justify-center gap-4"
            >
                <div className="flex justify-between w-full">
                    <div />
                    <div className="flex gap-2 items-center">
                        <InstagramIcon className="text-pink-500 w-4 h-4" />
                        <p>Instagram Feed</p>
                    </div>
                    <DeleteIntegrationPopover id={accountLink.id} />
                </div>
                <PairAccountButton
                    label="Your Instagram account has been disconnected. Click to reconnect"
                    link={process.env.NEXT_PUBLIC_URL! + '/api/instagram'}
                />
            </div>
        )

    const { media, profile } = await getInstagramProfileAndMedia(accessToken)

    return (
        <div
            className="rounded-md bg-card text-card-foreground text-sm
         tracking-tight leading-none border p-3"
        >
            <div className="mb-3">
                <Link
                    className="flex gap-2 justify-center"
                    href={`https://instagram.com/${profile.username}`}
                >
                    <InstagramIcon className="text-pink-500 w-4 h-4" />
                    {profile.username}
                </Link>
            </div>
            <ScrollArea className="h-80">
                <div className="grid gap-2">
                    {media
                        .filter(
                            ({ media_type }) =>
                                media_type === 'IMAGE' ||
                                media_type === 'CAROUSEL_ALBUM'
                        )
                        .map((post) => (
                            <Link
                                href={post.permalink || '/404'}
                                key={post.id}
                                className="flex flex-col justify-center items-center group"
                            >
                                <Image
                                    className="rounded-md h-56 w-48"
                                    src={post.media_url}
                                    alt="Instagram image"
                                    width={500}
                                    height={500}
                                />
                                <div className="flex flex-col gap-1 text-center w-48 mt-2">
                                    <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                                        {post.caption}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatDistanceToNow(
                                            new Date(post.timestamp),
                                            { addSuffix: true }
                                        )}
                                    </p>
                                </div>
                                <Separator className="my-4 group-last:hidden" />
                            </Link>
                        ))}
                </div>
            </ScrollArea>
        </div>
    )
}
