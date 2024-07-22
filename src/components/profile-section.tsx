import { MapPinIcon } from 'lucide-react'
import { ReactNode } from 'react'

export function ProfileSection({ children }: { children: ReactNode }) {
    return <div className="flex flex-col h-full">{children}</div>
}

export function ProfileSectionContent({ children }: { children: ReactNode }) {
    return <div className="flex flex-col">{children}</div>
}

export function ProfileSectionImage({ children }: { children: ReactNode }) {
    return <div className="pl-16 mt-1">{children}</div>
}

export function ProfileSectionInfoContainer({
    children,
}: {
    children: ReactNode
}) {
    return <div className="pl-14 mt-1">{children}</div>
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
            className="rounded-md transition-colors w-96
            p-3 text-left"
        >
            <p className="w-full text-4xl font-bold">
                {user.name || 'No name set'}
            </p>
            {user.location && (
                <div className="mt-2 font-normal flex items-center">
                    <MapPinIcon className="mr-2 w-4 h-4" />
                    <p>{user.location}</p>
                </div>
            )}
            <p className="mt-2 line-clamp-4 text-lg font-normal">
                {user.bio || 'No bio'}
            </p>
        </div>
    )
}

export function ProfileSectionLinks({ children }: { children: ReactNode }) {
    return <div className="mt-4 pl-10 flex gap-1">{children}</div>
}

export function ProfileSectionFooter({ children }: { children: ReactNode }) {
    return (
        <div className="pl-10 flex flex-col h-full justify-end items-start">
            {children}
        </div>
    )
}
