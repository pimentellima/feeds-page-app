import Link from 'next/link'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ErrorLinkingAccountPage() {
    return (
        <div className="h-screen bg-gradient flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>Error linking account</CardTitle>
                    <CardDescription>
                        There was an error while attempting to link your
                        account.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                    <Button variant={'link'} asChild>
                        <Link href={'/profile/customize'}>Go back</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
