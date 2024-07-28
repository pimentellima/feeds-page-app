import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
    return (
        <main className="bg-background min-h-screen flex flex-col items-center p-10">
            <div className="flex justify-start w-full">
                <Button asChild variant="link">
                    <Link href="/">
                        <ArrowLeftIcon className="mr-1 h-4 w-4" /> Go back
                    </Link>
                </Button>
            </div>
            <div className="w-1/2 flex flex-col">
                <div>
                    <h1 className="text-center text-3xl font-semibold">
                        How to remove access to your data
                    </h1>
                </div>
                <p className="mt-3">
                    If you wish to revoke access to your data that has been
                    shared with our application, please follow the instructions
                    below:
                </p>
                <ol className="text-left w-full mt-6 space-y-3">
                    <li>
                        <strong>Access the profile customization page</strong>:
                        <ul>
                            <li>
                                Click on the "Account" icon located in the top
                                right corner of the screen.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Manage Integrations</strong>:
                        <ul>
                            <li>
                                Select the "Manage integrations" option from the
                                menu.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Revoke Access</strong>:
                        <ul>
                            <li>
                                In the list of integrations, find the
                                integration you want to remove.
                            </li>
                            <li>
                                Click "Revoke access" next to the corresponding
                                integration.
                            </li>
                        </ul>
                    </li>
                </ol>
                <p className="mt-6">
                    These actions will ensure that our application no longer has
                    access to your data. If you have any questions or encounter
                    difficulties during the process, please contact our customer
                    support.
                </p>
                <p>Thank you for using our service!</p>
            </div>
        </main>
    )
}
