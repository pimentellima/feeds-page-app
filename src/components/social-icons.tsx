import GithubIcon from '@/components/github-icon'
import InstagramIcon from '@/components/instagram-icon'
import LinkedinIcon from '@/components/linkedin-icon'
import PinterestIcon from '@/components/pinterest-icon'
import SpotifyIcon from '@/components/spotify-icon'
import TiktokIcon from '@/components/tiktok-icon'
import XTwitterIcon from '@/components/xtwitter-icon'
import YoutubeIcon from '@/components/youtube-icon'
import { cn } from '@/lib/utils'

import { SVGProps } from 'react'

export function SocialLinkIcon({
    linkType,
    className,
    ...props
}: SVGProps<SVGSVGElement> & {
    linkType:
        | 'tiktok'
        | 'instagram'
        | 'x'
        | 'youtube'
        | 'linkedin'
        | 'github'
        | 'spotify'
        | 'pinterest'
}) {
    if (linkType === 'tiktok')
        return (
            <TiktokIcon
                className={cn(
                    'sm:h-5 sm:w-5 h-4 w-4 fill-foreground',
                    className
                )}
                {...props}
            />
        )
    if (linkType === 'instagram')
        return (
            <InstagramIcon
                className={cn('sm:h-5 sm:w-5 h-4 w-4 text-pink-700', className)}
                {...props}
            />
        )
    if (linkType === 'x')
        return (
            <XTwitterIcon
                className={cn(
                    'sm:h-5 sm:w-5 h-4 w-4 fill-foreground',
                    className
                )}
                {...props}
            />
        )
    if (linkType === 'youtube')
        return (
            <YoutubeIcon
                className={cn(
                    'sm:h-5 sm:w-5 h-4 w-4 text-white fill-red-700',
                    className
                )}
                {...props}
            />
        )
    if (linkType === 'linkedin')
        return (
            <LinkedinIcon
                className={cn('sm:h-5 sm:w-5 h-4 w-4 text-blue-900', className)}
                {...props}
            />
        )
    if (linkType === 'github')
        return (
            <GithubIcon
                className={
                    (cn(
                        'sm:h-5 sm:w-5 h-4 w-4 fill-foreground text-background'
                    ),
                    className)
                }
                {...props}
            />
        )
    if (linkType === 'spotify')
        return (
            <SpotifyIcon
                className={cn(
                    'sm:h-5 sm:w-5 h-4 w-4 text-white fill-green-600',
                    className
                )}
                {...props}
            />
        )

    if (linkType === 'pinterest')
        return (
            <PinterestIcon
                className={cn('sm:h-4 sm:w-4 h-4 w-4 text-red-700', className)}
                {...props}
            />
        )

    return null
}
