import { ReactNode } from 'react'

export function ProfileSection({ children }: { children: ReactNode }) {
    return <div className="flex flex-col h-full items-center w-full">{children}</div>
}

export function ProfileSectionContent({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-center w-full">
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
        bio?: string | null
    }
}) {
    return (
        <div
            className="rounded-md transition-colors max-w-64 sm:max-w-96
            p-3 text-left font-sans lg:leading-normal leading-tight"
        >
            <h2 className="w-full text-xl lg:text-3xl font-bold">
                {user.name || 'No name set'}
            </h2>
            <p
                className="mt-1 lg:mt-2 line-clamp-4 lg:text-lg font-normal
                tracking-tight lg:tracking-normal"
            >
                {user.bio || 'No bio'}
            </p>
        </div>
    )
}

export function ProfileSectionLinks({ children }: { children: ReactNode }) {
    return (
        <div className="my-2 sm:my-3 flex justify-center gap-1">
            {children}
        </div>
    )
}