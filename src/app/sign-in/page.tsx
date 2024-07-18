import { auth } from '@/lib/auth'
import SignInForm from './sign-in-form'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
    const session = await auth()

    if (session?.user) {
        redirect('/profile/customize')
    }

    return (
        <div className="bg-background flex justify-center items-center h-screen">
            <SignInForm />
        </div>
    )
}
