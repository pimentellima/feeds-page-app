import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { CheckIcon, LinkIcon, SlidersVerticalIcon, UserIcon } from 'lucide-react'

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
                                    platforms, customize your feed, and get
                                    AI-powered content recommendations.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Link
                                    href="#"
                                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    prefetch={false}
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="#"
                                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    prefetch={false}
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <img
                            src="/placeholder.svg"
                            width="550"
                            height="550"
                            alt="Hero"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
                        />
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-12">
                        <div className="grid gap-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                Get Started in 3 Easy Steps
                            </h2>
                            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Sign up, connect your social accounts, and start
                                exploring your personalized feed.
                            </p>
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
                                        Customize Feed
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Tailor your feed to your interests and
                                        preferences.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Link
                                href="#"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
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

/* function GetStartedSection() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between p-10 bg-accent text-accent-foreground">
            <div className="md:w-1/2">
                <h2 className="text-4xl font-bold mb-4">
                    Create and share your personalized social media feeds in
                    minutes
                </h2>
                <p className="text-lg mb-6">
                    Connect your TikTok, Instagram, Twitter, and more. Share
                    your profile with others and keep your followers up to date
                    with your latest posts.
                </p>
                <a
                    href="#"
                    className="inline-block px-6 py-3 bg-purple-900 text-white font-semibold rounded"
                >
                    Get started for free
                </a>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0"></div>
        </section>
    )
} */

function PricingSection() {
    return (
        <div className="border-t">
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            Pricing
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground">
                            Choose the plan that best fits your social media
                            management needs.
                        </p>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                        <Card className="border-0 shadow-lg">
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
                                        <span>1 Social Account</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Basic Post Scheduling</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Basic Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Email Support</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 text-center">
                                <Button size="lg">Get Started</Button>
                            </CardFooter>
                        </Card>
                        <Card className="border-0 shadow-lg">
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
                                        <span>5 Social Accounts</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Advanced Post Scheduling</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Comprehensive Analytics</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                        <span>Priority Email Support</span>
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
            <section className="w-full max-w-4xl mx-auto py-12 md:py-24">
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
                                            instructions. You'll need to provide
                                            your name, email address, and a
                                            secure password.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I change my profile picture?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To change your profile picture, go
                                            to your profile page, tap the edit
                                            icon, and select a new image from
                                            your device's photo library. You can
                                            also take a new photo using the
                                            in-app camera.
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
                        <AccordionItem value="newsfeed">
                            <AccordionTrigger className="text-lg font-medium">
                                Newsfeed
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-6">
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I customize my newsfeed?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To customize your newsfeed, go to
                                            the settings menu and select
                                            "Newsfeed Preferences". Here, you
                                            can choose to follow specific
                                            topics, accounts, or hashtags, and
                                            adjust the algorithm to prioritize
                                            content that interests you.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I hide or mute content?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To hide or mute content, tap the
                                            three-dot menu icon on a post and
                                            select the appropriate option. You
                                            can choose to hide content from a
                                            specific user, mute keywords or
                                            hashtags, or snooze content for a
                                            set period of time.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I save or bookmark posts?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To save or bookmark a post, tap the
                                            bookmark icon on the post. You can
                                            access your saved posts by going to
                                            your profile page and selecting the
                                            "Saved" tab.
                                        </p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="notifications">
                            <AccordionTrigger className="text-lg font-medium">
                                Notifications
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid gap-6">
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I manage my notification
                                            settings?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To manage your notification
                                            settings, go to the settings menu
                                            and select "Notifications". Here,
                                            you can choose which types of
                                            notifications you want to receive,
                                            such as new posts, comments,
                                            messages, and more.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I turn off notifications for
                                            a specific account?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To turn off notifications for a
                                            specific account, go to that
                                            account's profile page, tap the
                                            three-dot menu icon, and select
                                            "Mute Notifications". You can also
                                            adjust your global notification
                                            settings to disable notifications
                                            from all accounts.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I mark notifications as read?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To mark notifications as read,
                                            simply tap on the notification to
                                            open it. You can also go to the
                                            notifications tab and tap the "Mark
                                            All as Read" button to clear all
                                            unread notifications.
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
                                            How do I control who can see my
                                            posts?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To control who can see your posts,
                                            go to your profile settings and
                                            select "Privacy". Here, you can
                                            choose to make your account public,
                                            private, or set custom privacy
                                            settings for individual posts.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I block or report a user?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To block or report a user, go to
                                            their profile page, tap the
                                            three-dot menu icon, and select the
                                            appropriate option. Blocking a user
                                            will prevent them from interacting
                                            with your content, while reporting a
                                            user will notify our moderation
                                            team.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-medium">
                                            How do I enable two-factor
                                            authentication?
                                        </h3>
                                        <p className="text-muted-foreground">
                                            To enable two-factor authentication,
                                            go to your account settings, select
                                            "Security", and turn on the
                                            "Two-Factor Authentication" option.
                                            This will add an extra layer of
                                            security to your account by
                                            requiring a verification code in
                                            addition to your password.
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
                <h3 className="font-semibold uppercase mb-2">Feeds page</h3>
                <Link className="hover:underline underline-offset-4" href="#">
                    Home
                </Link>
                <Link
                    className="hover:underline underline-offset-4"
                    href="#features"
                >
                    Features
                </Link>
                <Link
                    className="hover:underline underline-offset-4"
                    href="#pricing"
                >
                    Pricing
                </Link>
            </div>
            <div className="flex flex-col gap-1 w-max">
                <h3 className="font-semibold uppercase mb-2">Join</h3>
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
