import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
    return (
        <main className="bg-background min-h-screen flex flex-col items-center py-3 md:py-20">
            <div className="mx-3 md:mx-0 md:w-1/2 flex flex-col gap-8 p-3 md:p-14 border rounded-md bg-card text-card-foreground ">
                <div>
                    <h1 className="text-center text-3xl font-semibold">
                        How to remove access to your data
                    </h1>
                </div>
                <p className="text-center mt-1">
                    If you wish to revoke access to your data that has been
                    shared with our application, please follow the instructions
                    below:
                </p>
                <ol className='space-y-3'>
                    <li>
                        <strong className="text-xl font-medium">
                            1. Access the profile customization page
                        </strong>
                        :
                        <ul className="text-muted-foreground">
                            <li>
                                Click on the "Account" icon located in the top
                                right corner of the screen.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong className="text-xl font-medium">
                            2. Manage Integrations
                        </strong>
                        :
                        <ul className="text-muted-foreground">
                            <li>
                                Select the "Integrations" option from the
                                menu.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong className='text-xl font-medium'>3. Revoke Access</strong>:
                        <ul className='text-muted-foreground'>
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
                <p>
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
