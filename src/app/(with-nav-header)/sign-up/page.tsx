import { auth } from '@/lib/auth'
import SignUpForm from './sign-up-form'
import { redirect } from 'next/navigation'

export default async function SignUpPage({
    searchParams,
}: {
    searchParams: {
        username?: string
    }
}) {
    const session = await auth()

    if (!!session?.user) {
        redirect('/profile/customize')
    }

    return (
        <div className="bg-background flex justify-center items-center h-screen px-3 md:px-0">
            <SignUpForm username={searchParams.username} />
        </div>
    )
}
