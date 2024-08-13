import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}

function Header() {
    return (
        <div className="sticky z-10 top-4 w-full hidden md:block px-60">
            <div
                className="p-2 bg-accent
             shadow-md border z-50 rounded-md md:flex justify-between items-center"
            >
                <div className="flex items-center ">
                    <Button
                        className=" hover:bg-background/30"
                        asChild
                        variant={'ghost'}
                    >
                        <Link href={'/'}>Feed Page</Link>
                    </Button>
                    <Button
                        className=" hover:bg-background/30"
                        asChild
                        variant={'ghost'}
                    >
                        <Link href={'/#get-started'}>Get started</Link>
                    </Button>
                    <Button
                        className=" hover:bg-background/30"
                        asChild
                        variant={'ghost'}
                    >
                        <Link href={'/#pricing'}>Pricing</Link>
                    </Button>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        asChild
                        variant={'ghost'}
                        className=" hover:bg-background/30 "
                    >
                        <Link href={'/sign-in'}>Sign in</Link>
                    </Button>
                    <Button
                        size={'lg'}
                        className=" hover:bg-background/70 "
                        asChild
                        variant={'outline'}
                    >
                        <Link href={'/sign-up'}>Sign up free</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
