import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ArrowLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Privacy policy - Feeds Page',
    description: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-10">
            <div className="flex justify-start w-full">
                <Button asChild variant="link">
                    <Link href="/">
                        <ArrowLeftIcon className="mr-1 h-4 w-4" /> Go back
                    </Link>
                </Button>
            </div>
            <div className="w-1/2 flex flex-col gap-8">
                <div>
                    <h2 className="text-center text-3xl font-semibold">
                        Privacy Policy
                    </h2>
                    <p className="text-center mt-1">
                        {`Last updated: ${format(
                            new Date('2024-07-25T22:04:37.226Z'),
                            'dd/MM/yyyy HH:mm'
                        )}`}
                    </p>
                    <p className="mt-3">
                        Your privacy is very important to us. This Privacy
                        Policy explains how we collect, use, store, and protect
                        the information you provide when using our application.
                        By using our app, you agree to the collection and use of
                        information in accordance with this policy.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        1. Information We Collect
                    </h3>
                    <p>
                        We only collect the basic information necessary for you
                        to enjoy the features of our application. The
                        information collected includes:
                    </p>
                    <ul>
                        <li>
                            <strong>Username:</strong> For identification within
                            the platform.
                        </li>
                        <li>
                            <strong>Public URL:</strong> To access your social
                            media and display your posts.
                        </li>
                        <li>
                            <strong>Recent Posts:</strong> Including post image,
                            post date, and title.
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        2. How We Use Your Information
                    </h3>
                    <p>The information we collect is used to:</p>
                    <ul>
                        <li>
                            Create and maintain your personalized page with mini
                            feeds from your social media.
                        </li>
                        <li>
                            Allow you to share your page with others,
                            facilitating access to your profiles on social
                            media.
                        </li>
                        <li>
                            Improve user experience and the functionality of our
                            application.
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        3. Information Sharing
                    </h3>
                    <p>
                        The information we collect is used only for the purposes
                        described in this Privacy Policy. We do not share your
                        personal information with third parties, except when
                        necessary to comply with the law or protect our rights.
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-medium">4. Data Storage</h3>
                    <p>
                        We store your information on secure servers and take
                        reasonable measures to protect your information from
                        unauthorized access, use, or disclosure. However, no
                        data transmission over the internet or method of
                        electronic storage is 100% secure. Therefore, we cannot
                        guarantee absolute security.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">5. Your Rights</h3>
                    <p>
                        You have the right to access, correct, or delete your
                        personal information at any time. To do so, please
                        contact us through our support.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        6. Changes to This Privacy Policy
                    </h3>
                    <p>
                        We may update our Privacy Policy periodically. We will
                        notify you of any changes by posting the new Privacy
                        Policy on this page. We recommend reviewing this Privacy
                        Policy regularly to stay informed about our practices.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">7. Contact</h3>
                    <p>
                        If you have any questions or concerns about this Privacy
                        Policy, please contact us at{' '}
                        <Link
                            className="hover:underline underline-offset-4"
                            href="matheuspimentel910@gmail.com"
                        >
                            matheuspimentel910@gmail.com
                        </Link>
                        .
                    </p>
                </div>

                <p className="mt-3">
                    Thank you for choosing our application and for trusting us
                    with your personal information. We are committed to
                    protecting your privacy and providing a safe and enjoyable
                    experience.
                </p>
            </div>
        </main>
    )
}
