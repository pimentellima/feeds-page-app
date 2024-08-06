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
        <div className="absolute top-4 w-full hidden md:block px-24">
            <div className="p-2 shadow-sm z-50 rounded-md md:flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Button asChild variant={'ghost'}>
                        <Link href={'/'}>Home</Link>
                    </Button>
                    <Button asChild variant={'ghost'}>
                        <Link href={'/#get-started'}>Get started</Link>
                    </Button>
                    <Button asChild variant={'ghost'}>
                        <Link href={'/#pricing'}>Pricing</Link>
                    </Button>
                </div>
                <div className="flex items-center gap-1">
                    <Button asChild variant={'ghost'}>
                        <Link href={'/sign-in'}>Sign in</Link>
                    </Button>
                    <Button asChild variant={'ghost'}>
                        <Link href={'/sign-up'}>Sign up free</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
