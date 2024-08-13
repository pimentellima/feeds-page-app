import { MapPinIcon } from 'lucide-react'
import { ReactNode } from 'react'

export function ProfileSection({ children }: { children: ReactNode }) {
    return <div className="flex flex-col h-full items-center">{children}</div>
}

export function ProfileSectionContent({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center">
            {children}
        </div>
    )
}

export function ProfileSectionImage({ children }: { children: ReactNode }) {
    return <div className='mr-1'>{children}</div>
}

export function ProfileSectionInfoContainer({
    children,
}: {
    children: ReactNode
}) {
    return <div className=''>{children}</div>
}

export function ProfileSectionInfo({
    user,
}: {
    user: {
        name?: string | null
        location?: string | null
        bio?: string | null
    }
}) {
    return (
        <div
            className="rounded-md transition-colors max-w-96
            p-3 text-left font-sans"
        >
            <h2 className="w-full text-2xl lg:text-4xl font-bold">
                {user.name || 'No name set'}
            </h2>
            {user.location && (
                <div className="mt-1 lg:mt-2 font-normal flex items-center tracking-tight lg:tracking-normal">
                    <MapPinIcon className="mr-2 w-4 h-4" />
                    <p>{user.location}</p>
                </div>
            )}
            <p
                className="mt-1 lg:mt-2 line-clamp-4 lg:text-lg font-normal 
            lg:leading-normal leading-tight tracking-tight lg:tracking-normal"
            >
                {user.bio || 'No bio'}
            </p>
        </div>
    )
}

export function ProfileSectionLinks({ children }: { children: ReactNode }) {
    return (
        <div className="mt-4 lg:pl-12 flex justify-center lg:justify-normal gap-1">
            {children}
        </div>
    )
}

export function ProfileSectionFooter({ children }: { children: ReactNode }) {
    return (
        <div className="fixed bottom-5 right-5 lg:static lg:pl-10 
                lg:flex lg:flex-col lg:h-full lg:justify-end lg:items-start z-20">
            {children}
        </div>
    )
}
