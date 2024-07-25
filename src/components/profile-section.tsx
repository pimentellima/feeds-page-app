import { MapPinIcon } from 'lucide-react'
import { ReactNode } from 'react'

export function ProfileSection({ children }: { children: ReactNode }) {
    return <div className="flex flex-col h-full">{children}</div>
}

export function ProfileSectionContent({ children }: { children: ReactNode }) {
    return (
        <div className="flex sm:flex-col items-center sm:items-start">
            {children}
        </div>
    )
}

export function ProfileSectionImage({ children }: { children: ReactNode }) {
    return <div className="sm:pl-16 mt-1">{children}</div>
}

export function ProfileSectionInfoContainer({
    children,
}: {
    children: ReactNode
}) {
    return <div className="sm:pl-14 mt-1">{children}</div>
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
            className="rounded-md transition-colors sm:w-96
            p-3 text-left font-sans"
        >
            <h2 className="w-full text-2xl sm:text-4xl font-bold bg-gradient text-transparent inline-block bg-clip-text">
                {user.name || 'No name set'}
            </h2>
            {user.location && (
                <div className="mt-1 sm:mt-2 font-normal flex items-center tracking-tight sm:tracking-normal">
                    <MapPinIcon className="mr-2 w-4 h-4" />
                    <p>{user.location}</p>
                </div>
            )}
            <p
                className="mt-1 sm:mt-2 line-clamp-4 sm:text-lg font-normal 
            sm:leading-normal leading-tight tracking-tight sm:tracking-normal"
            >
                {user.bio || 'No bio'}
            </p>
        </div>
    )
}

export function ProfileSectionLinks({ children }: { children: ReactNode }) {
    return (
        <div className="mt-4 sm:pl-12 flex justify-center sm:justify-normal gap-1">
            {children}
        </div>
    )
}

export function ProfileSectionFooter({ children }: { children: ReactNode }) {
    return (
        <div className="fixed bottom-5 right-5 sm:static sm:pl-10 
                sm:flex sm:flex-col sm:h-full sm:justify-end sm:items-start z-20">
            {children}
        </div>
    )
}
