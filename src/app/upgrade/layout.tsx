import { auth } from '@/lib/auth'
import { getSubscriptionByUserId } from '@/services/subscriptions'
import { getUser } from '@/services/user'
import { redirect } from 'next/navigation'
import { SignOutButton } from '../profile/customize/sign-out-button'

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { username: string }
}) {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    return (
        <>
            <div
                className="absolute top-3 sm:top-5 sm:right-14 
                    flex items-center justify-between sm:justify-normal
                     gap-1 w-full px-6 sm:w-auto sm:px-0"
            >
                <SignOutButton />
            </div>
            {children}
        </>
    )
}
