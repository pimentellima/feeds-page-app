import { Button } from '@/components/ui/button'
import { LinkIcon, SlidersVerticalIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="bg-background">
            <div className="hidden absolute top-5 right-14 sm:grid grid-cols-3 items-center gap-1">
                <Button asChild variant={'ghost'}>
                    <Link href={'/sign-in'}>Sign in</Link>
                </Button>
                <Button asChild variant={'ghost'}>
                    <Link href={'#get-started'}>Get started</Link>
                </Button>
                <Button asChild variant={'ghost'}>
                    <Link href={'#pricing'}>Pricing</Link>
                </Button>
            </div>
            <HeroSection />
            <GetStartedSection />
            <PricingSection />
            <Footer />
        </div>
    )
}

function HeroSection() {
    return (
        <section className="w-full py-20 md:py-24 lg:py-32 border-b">
            <div className="container px-2 md:px-6 grid grid-cols-2">
                <div className="flex flex-col justify-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                        All-in-One Social Media Feed
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                        Aggregate posts from all your social media platforms,
                        customize your page, and easily share your updates.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Link
                            href="/sign-in"
                            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Image
                        className="rounded-[2.5rem] ring-8 ring-secondary z-0 overflow-hidden"
                        height={550}
                        width={275}
                        quality={100}
                        alt="Cellphone mockup"
                        src="/list-view-sem-moldura.png"
                    />
                </div>
            </div>
        </section>
    )
}

function GetStartedSection() {
    return (
        <section
            id="get-started"
            className="w-full py-12 md:py-24 lg:py-32 bg-secondary text-secondary-foreground"
        >
            <div className="container px-4 md:px-6">
                <div className="grid gap-12">
                    <div className="grid gap-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            Get Started in 3 Easy Steps
                        </h2>
                    </div>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-primary rounded-full p-4 text-primary-foreground">
                                <UserIcon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2 text-center sm:text-left">
                                <h3 className="text-xl font-bold">Sign Up</h3>
                                <p className="text-muted-foreground">
                                    Create your account in just a few clicks.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-primary rounded-full p-4 text-primary-foreground">
                                <LinkIcon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2 text-center sm:text-left">
                                <h3 className="text-xl font-bold">
                                    Connect Accounts
                                </h3>
                                <p className="text-muted-foreground">
                                    Link your social media profiles to start
                                    aggregating your feeds.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-primary rounded-full p-4 text-primary-foreground">
                                <SlidersVerticalIcon className="w-6 h-6" />
                            </div>
                            <div className="space-y-2 text-center sm:text-left">
                                <h3 className="text-xl font-bold">
                                    Customize Page
                                </h3>
                                <p className="text-muted-foreground">
                                    Tailor your page style to your preferences.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Link
                            href="/sign-in"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Sign Up Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

function PricingSection() {
    return (
        <div className="border-t">
            <section
                id="pricing"
                className="bg-background py-32 md:py-36 lg:py-40"
            >
                <div className="container grid items-center gap-8 px-4 md:px-6">
                    <div className="mx-auto max-w-md text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Pricing
                        </h2>
                        <p className="mt-4 text-muted-foreground md:text-lg">
                            Get lifetime access to our social media feed
                            aggregator for a one-time payment.
                        </p>
                    </div>
                    <div className="mx-auto max-w-md rounded-lg border bg-card p-6 shadow-sm md:p-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-4xl font-bold">$20</div>
                            <p className="text-sm text-muted-foreground">
                                Lifetime Access
                            </p>
                            <Button className="w-full">
                                <Link href="sign-in">Get Started</Link>
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                No monthly fees, no hidden costs.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function Footer() {
    return (
        <footer className="border-t grid grid-cols-3 px-12 sm:px-40 py-16 text-sm bg-secondary text-secondary-foreground">
            <div className="flex flex-col gap-1 w-max">
                <h3 className="font-semibold uppercase mb-2">Links</h3>
                <Link className="hover:underline underline-offset-4" href="/">
                    Home
                </Link>
                <Link
                    className="hover:underline underline-offset-4"
                    href="#get-started"
                >
                    Get started
                </Link>
                <Link
                    className="hover:underline underline-offset-4"
                    href="#pricing"
                >
                    Pricing
                </Link>
            </div>
            <div className="flex flex-col gap-1 w-max">
                <h3 className="font-semibold uppercase mb-2">Sign</h3>
                <Link
                    className="hover:underline underline-offset-4"
                    href="/sign-in"
                >
                    Sign in
                </Link>
                <Link
                    className="hover:underline underline-offset-4"
                    href="/sign-up"
                >
                    Sign up
                </Link>
            </div>
            <div className="flex flex-col gap-1 w-max">
                <h3 className="font-semibold uppercase mb-2">Tos & Privacy</h3>
                <Link
                    className="hover:underline underline-offset-4"
                    href="/tos"
                >
                    Terms of service
                </Link>
                <Link
                    className="hover:underline underline-offset-4"
                    href="/pivacy-policy"
                >
                    Privacy policy
                </Link>
            </div>
        </footer>
    )
}
