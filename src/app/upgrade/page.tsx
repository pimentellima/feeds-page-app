import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import RefreshButton from './refresh-button'
import { auth } from '@/lib/auth'

const paymentStatusMessage: Record<Stripe.Checkout.Session.Status, string> = {
    complete: 'Payment complete',
    expired: 'Payment expired',
    open: 'Payment open',
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
})

export default async function UpgradePage({
    searchParams,
}: {
    searchParams: {
        session_id?: string
        canceled?: 'true' | 'false'
    }
}) {
    const session = await auth()
    if (!session?.user) {
        return redirect('/sign-in')
    }

    if (!searchParams.session_id && !searchParams.canceled) {
        return redirect('/profile-customize')
    }

    const checkoutSession = searchParams.session_id
        ? await stripe.checkout.sessions.retrieve(searchParams.session_id)
        : null

    if (searchParams.canceled === 'true')
        return (
            <div className="h-screen flex justify-center items-center bg-background">
                <Card className=" w-[350px]">
                    <CardHeader>
                        <CardTitle>Purchase details</CardTitle>
                        <CardDescription>Payment canceled</CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-end">
                        <Button variant={'link'} asChild>
                            <Link href={'/profile/customize'}>Go back</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )

    if (checkoutSession?.status)
        return (
            <div className="h-screen flex justify-center items-center bg-background">
                <Card className=" w-[350px]">
                    <CardHeader>
                        <CardTitle>Purchase details</CardTitle>
                        <CardDescription>
                            {paymentStatusMessage[checkoutSession.status]}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-end">
                        <Button variant={'link'} asChild>
                            <Link href={'/profile/customize'}>
                                Go back to user page
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )

    return (
        <div className="h-screen flex justify-center items-center bg-background">
            <Card className=" w-[350px]">
                <CardHeader>
                    <CardTitle>Purchase details</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    Refresh the page to see the purchase details
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button asChild variant={'link'}>
                        <Link href={'/profile/customize'}>
                            Go back to profile page{' '}
                        </Link>
                    </Button>
                    <RefreshButton />
                </CardFooter>
            </Card>
        </div>
    )
}
