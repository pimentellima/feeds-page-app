import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ArrowLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'TOS - Feed Page',
    description: 'TOS',
}

export default function TosPage() {
    return (
        <main className="bg-background min-h-screen flex flex-col items-center py-3 md:py-20">
            <div className="mx-3 md:mx-0 md:w-1/2 flex flex-col gap-8 p-3 md:p-14 border rounded-md bg-card text-card-foreground ">
                <div>
                    <h2 className="text-center text-3xl font-semibold">
                        Terms and Conditions
                    </h2>
                    <p className="text-center mt-1">
                        {`Last updated: ${format(
                            new Date('2024-07-25T22:04:37.226Z'),
                            'dd/MM/yyyy HH:mm'
                        )}`}
                    </p>
                    <p className="mt-3">
                        Welcome to our application! These Terms and Conditions
                        outline the rules and regulations for the use of our
                        app. By accessing or using our application, you agree to
                        comply with these terms. If you do not agree with any
                        part of these terms, you must not use our app.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        1. Acceptance of Terms
                    </h3>
                    <p className='text-muted-foreground'>
                        By using our application, you confirm that you are at
                        least 13 years old and have the legal capacity to enter
                        into these Terms and Conditions. If you are using the
                        app on behalf of an organization, you represent that you
                        have the authority to bind that organization to these
                        terms.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">2. User Accounts</h3>
                    <p className='text-muted-foreground'>
                        To access certain features of our app, you may be
                        required to create an account. You agree to provide
                        accurate, current, and complete information during the
                        registration process and to update such information to
                        keep it accurate, current, and complete. You are
                        responsible for maintaining the confidentiality of your
                        account and password and for restricting access to your
                        account.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        3. Use of the Application
                    </h3>
                    <p className='text-muted-foreground'>
                        You agree to use the application only for lawful
                        purposes and in accordance with these Terms and
                        Conditions. You must not use the app:
                    </p>
                    <ul className='text-muted-foreground'>
                        <li>
                            In any way that violates any applicable federal,
                            state, local, or international law or regulation.
                        </li>
                        <li>
                            For the purpose of exploiting, harming, or
                            attempting to exploit or harm minors in any way.
                        </li>
                        <li>
                            To transmit, or procure the sending of, any
                            advertising or promotional material without our
                            prior written consent.
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        4. Intellectual Property Rights
                    </h3>
                    <p className='text-muted-foreground'>
                        All content, features, and functionality on the
                        application, including but not limited to text,
                        graphics, logos, and software, are the exclusive
                        property of the app or its licensors and are protected
                        by copyright, trademark, and other intellectual property
                        laws.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        5. Limitation of Liability
                    </h3>
                    <p className='text-muted-foreground'>
                        To the fullest extent permitted by law, in no event
                        shall we, our affiliates, or our licensors be liable for
                        any indirect, incidental, special, consequential, or
                        punitive damages, including without limitation loss of
                        profits, data, use, goodwill, or other intangible
                        losses, resulting from:
                    </p>
                    <ul className='text-muted-foreground'>
                        <li>
                            Your access to or use of, or inability to access or
                            use, the application.
                        </li>
                        <li>
                            Any conduct or content of any third party on the
                            application.
                        </li>
                        <li>Any content obtained from the application.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-medium">
                        6. Changes to These Terms
                    </h3>
                    <p className='text-muted-foreground'>
                        We may update our Terms and Conditions from time to
                        time. We will notify you of any changes by posting the
                        new Terms and Conditions on this page. You are advised
                        to review these terms periodically for any changes.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">7. Governing Law</h3>
                    <p className='text-muted-foreground'>
                        These Terms and Conditions shall be governed by and
                        construed in accordance with the laws of [Your
                        Country/State], without regard to its conflict of law
                        principles.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-medium">8. Contact Us</h3>
                    <p className='text-muted-foreground'>
                        If you have any questions about these Terms and
                        Conditions, please contact us at{' '}
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
                    Thank you for using our application. We hope you enjoy your
                    experience!
                </p>
            </div>
        </main>
    )
}
