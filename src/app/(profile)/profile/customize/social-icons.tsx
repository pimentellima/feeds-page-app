import TiktokIcon from '@/components/tiktok-icon'
import XTwitterIcon from '@/components/xtwitter-icon'
import { socialLinks } from '@/drizzle/schema'
import { cn } from '@/lib/utils'
import { InferSelectModel } from 'drizzle-orm'
import {
    GithubIcon,
    InstagramIcon,
    LinkedinIcon,
    YoutubeIcon
} from 'lucide-react'
import { SVGProps } from 'react'

export function SocialLinkIcon({
    linkType,
    className,
    ...props
}: SVGProps<SVGSVGElement> & {
    linkType: InferSelectModel<typeof socialLinks>['type']
}) {
    if (linkType === 'tiktok')
        return (
            <TiktokIcon
                className={cn('h-5 w-5 fill-foreground', className)}
                {...props}
            />
        )
    if (linkType === 'instagram')
        return (
            <InstagramIcon
                className={cn('h-5 w-5 text-pink-500', className)}
                {...props}
            />
        )
    if (linkType === 'x')
        return (
            <XTwitterIcon
                className={cn('h-5 w-5 text-foreground', className)}
                {...props}
            />
        )
    if (linkType === 'youtube')
        return (
            <YoutubeIcon
                className={cn('h-5 w-5 text-red-500', className)}
                {...props}
            />
        )
    if (linkType === 'linkedin')
        return (
            <LinkedinIcon
                className={cn('h-5 w-5 text-blue-500', className)}
                {...props}
            />
        )
    if (linkType === 'github')
        return (
            <GithubIcon
                className={
                    (cn('h-5 w-5 text-foreground fill-background'), className)
                }
                {...props}
            />
        )

    return null
}
