import PinterestScroll from '@/components/pinterest-scroll'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
    InstagramTitle,
    PinterestTitle,
    Widget,
    WidgetContent,
    WidgetGrid,
    WidgetHeader,
    WidgetTitle,
} from '@/components/widget'
import {
    CheckIcon,
    LinkIcon,
    SlidersVerticalIcon,
    UserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { instagramMocks, pinterestMocks } from './mocks'
import InstagramScroll from '@/components/instagram-scroll'

export default function Home() {
    return (
        <div className="bg-background">
            <div className="hidden absolute top-5 right-14 sm:flex items-center gap-1">
                <Button asChild variant={'link'}>
                    <Link href={'/sign-in'}>Sign in</Link>
                </Button>
                <Button asChild variant={'link'}>
                    <Link href={'/sign-up'}>Create account</Link>
                </Button>
            </div>
            <GetStartedSection />
            <PricingSection />
            <FaqSection />
            <Footer />
        </div>
    )
}

function GetStartedSection() {
    return (
        <div className="w-full">
            <section className="w-full py-12 md:py-24 lg:py-32 border-b">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                    All-in-One Social Media Feed
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Aggregate posts from all your social media
                                    platforms, customize your page, and easily
                                    share your latest updates.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link
                                    href="#get-started"
                                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    prefetch={false}
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                        <ShowcaseWidgets />
                    </div>
                </div>
            </section>
            <section
                id="get-started"
                className="w-full py-12 md:py-24 lg:py-32"
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
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">
                                        Sign Up
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Create your account in just a few
                                        clicks.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-accent rounded-full p-4 text-accent-foreground">
                                    <LinkIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
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
                                <div className="bg-secondary rounded-full p-4 text-secondary-foreground">
                                    <SlidersVerticalIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">
                                        Customize Page
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Tailor your page style to your
                                        preferences.
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
        </div>
    )
}

function PricingSection() {
    return (
        <div className="border-t">
            <section id="pricing" className="w-full py-8 md:py-20 lg:py-24">
                <div className="container px-4 md:px-6 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            Pricing
                        </h2>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                        <Card className="shadow-lg">
                            <CardHeader className="bg-primary text-primary-foreground p-6 text-center">
                                <h3 className="text-2xl font-bold">
                                    1 year pass
                                </h3>
                                <p className="text-4xl font-bold">$15</p>
                                <p className="text-sm">
                                    One-time payment. No subscription
                                </p>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Platform integration</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Customizable themes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Basic Analytics</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 text-center">
                                <Button size="lg">Get Started</Button>
                            </CardFooter>
                        </Card>
                        <Card className="shadow-lg">
                            <CardHeader className="bg-primary text-primary-foreground p-6 text-center">
                                <h3 className="text-2xl font-bold">
                                    Lifetime deal
                                </h3>
                                <p className="text-4xl font-bold">$25</p>
                                <p className="text-sm">
                                    One-time payment. No subscription
                                </p>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Platform integration</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Customizable themes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Basic Analytics</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 text-center">
                                <Button size="lg">Get Started</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}

function FaqSection() {
    return (
        <div className="border-t">
            <section
                id="faq"
                className="w-full max-w-4xl mx-auto py-16 md:py-28"
            >
                <div className="px-4 md:px-6 space-y-8">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold">FAQ</h2>
                        <p className="text-muted-foreground">
                            Get answers to your questions about our all-in-one
                            social media feed app.
                        </p>
                    </div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="account">
                            <AccordionTrigger className="text-lg font-medium">
                                Account Management
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-6">
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I create an account?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To create an account, simply tap the
                                            "Sign Up" button on the home screen
                                            and follow the on-screen
                                            instructions.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I delete my account?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To delete your account, go to your
                                            account settings, scroll down to the
                                            "Delete Account" section, and follow
                                            the prompts. Please note that this
                                            action is permanent and cannot be
                                            undone.
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="privacy">
                            <AccordionTrigger className="text-lg font-medium">
                                Privacy & Security
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-6">
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do i remove my current
                                            integrations?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To remove an integration, go to your
                                            account settings, select "Manage
                                            Integrations", and tap the "Revoke
                                            access" button next to the
                                            integration you wish to remove.
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
        </div>
    )
}

function Footer() {
    return (
        <footer className="border-t grid grid-cols-3 p-16 text-sm">
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
                <Link
                    className="hover:underline underline-offset-4"
                    href="#faq"
                >
                    Faq
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
                <h3 className="font-semibold uppercase mb-2">
                    Tos & Privacy policy
                </h3>
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

function ShowcaseWidgets() {
    return (
        <WidgetGrid gridSize={2}>
            <Widget>
                <WidgetHeader>
                    <WidgetTitle>
                        <PinterestTitle profile={{ username: 'johndoe123' }} />
                    </WidgetTitle>
                </WidgetHeader>
                <WidgetContent>
                    <PinterestScroll media={pinterestMocks} />
                </WidgetContent>
            </Widget>
            <Widget>
                <WidgetHeader>
                    <WidgetTitle>
                        <InstagramTitle profile={{ username: '_johndoe' }} />
                    </WidgetTitle>
                </WidgetHeader>
                <WidgetContent>
                    <InstagramScroll media={instagramMocks as any} />
                </WidgetContent>
            </Widget>
        </WidgetGrid>
    )
}
