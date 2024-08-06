'use client' // Error components must be Client Components

import { Button } from '@/components/ui/button'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { signOut, useSession } from 'next-auth/react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const session = useSession()

    return (
        <div className="h-screen bg-gradient flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>Something went wrong</CardTitle>
                    <CardDescription>
                        There was an error while loading the page.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                    {session && (
                        <Button onClick={() => signOut()} variant={'link'}>
                            Sign out
                        </Button>
                    )}
                    <Button onClick={() => reset()} variant={'link'}>
                        Reload
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
