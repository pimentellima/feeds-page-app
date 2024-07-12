import { auth } from '@/lib/auth'
import SignUpForm from './sign-up-form'
import { redirect } from 'next/navigation'

export default async function SignUpPage() {
    const session = await auth()

    if (!!session?.user) {
        redirect('/profile/customize')
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <SignUpForm />
        </div>
    )
}
