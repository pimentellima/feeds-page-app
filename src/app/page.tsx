import InstagramScroll from '@/components/instagram-scroll'
import TiktokScroll from '@/components/tiktok-scroll'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import {
    InstagramTitle,
    TiktokTitle,
    Widget,
    WidgetContent,
    WidgetGrid,
    WidgetHeader,
    WidgetTitle
} from '@/components/widget'
import {
    LinkIcon,
    SlidersVerticalIcon,
    UserIcon
} from 'lucide-react'
import Link from 'next/link'
import { instagramMocks, tiktokMocks } from './mocks'

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
            {/* <FaqSection /> */}
            <Footer />
        </div>
    )
}

function GetStartedSection() {
    return (
        <div className="w-full">
            <section className="w-full py-20 md:py-24 lg:py-48 border-b">
                <div className="container px-2 md:px-6">
                    <div className="flex flex-col justify-center items-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                            All-in-One Social Media Feed
                        </h1>
                        <p className="max-w-[700px] text-center text-muted-foreground md:text-xl">
                            Aggregate posts from all your social media
                            platforms, customize your page, and easily share
                            your updates.
                        </p>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link
                                href="#get-started"
                                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="get-started"
                className="w-full py-12 md:py-24 lg:py-32 bg-card text-accent-foreground"
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
                                <div className="bg-secondary rounded-full p-4 text-secondary-foreground">
                                    <SlidersVerticalIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-2 text-center sm:text-left">
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
            <section id="pricing" className="w-full py-20 md:py-24 lg:py-40">
                <div className="container px-4 md:px-6 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            Pricing
                        </h2>
                    </div>
                    <div className="flex justify-center mt-12 ">
                        <Card className="shadow-lg w-[400px]">
                            <CardHeader className="bg-primary text-primary-foreground p-6 text-center">
                                <h3 className="text-2xl font-bold">
                                    Lifetime deal
                                </h3>
                                <p className="text-4xl font-bold">$20</p>
                                <p className="text-sm">
                                    You pay only once and get lifetime access.
                                    No subscription.
                                </p>
                            </CardHeader>
                            <CardFooter className="p-6 flex justify-center">
                                <Button asChild size="lg">
                                    <Link href="sign-in">Get Started</Link>
                                </Button>
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
        <div className="border-t  bg-card">
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
        <footer className="border-t grid grid-cols-3 p-16 text-sm bg-card">
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
                    Tos & Privacy
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
                        <InstagramTitle profile={{ username: '_johndoe' }} />
                    </WidgetTitle>
                </WidgetHeader>
                <WidgetContent>
                    <InstagramScroll media={instagramMocks as any} />
                </WidgetContent>
            </Widget>
            <Widget>
                <WidgetHeader>
                    <WidgetTitle>
                        <TiktokTitle
                            user={{
                                username: 'johndoe123',
                                profile_deep_link: '/',
                            }}
                        />
                    </WidgetTitle>
                </WidgetHeader>
                <WidgetContent>
                    <TiktokScroll media={tiktokMocks as any} />
                </WidgetContent>
            </Widget>
        </WidgetGrid>
    )
}
