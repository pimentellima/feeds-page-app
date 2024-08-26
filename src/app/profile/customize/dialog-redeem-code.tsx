'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderIcon, TicketIcon } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'
import { redeemCode } from './actions'

export default function DialogRedeemCode() {
    const [error, formAction] = useFormState(redeemCode, undefined)

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline">
                    <TicketIcon className="mr-2 h-4 w-4" />
                    Redeem code
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Redeem code</DialogTitle>
                    <DialogDescription>
                        Insert the promo code you received to unlock premium
                        access.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url">Promotional code</Label>
                        <Input
                            className="col-span-3"
                            placeholder="Type here..."
                            name="code"
                        />
                        {!!error && (
                            <p className="col-span-4 text-destructive text-sm">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end mt-2">
                        <ButtonSubmitForm />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function ButtonSubmitForm() {
    const formStatus = useFormStatus()

    return (
        <Button disabled={formStatus.pending} type="submit" variant="default">
            {formStatus.pending && (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {formStatus.pending ? 'Redeeming code...' : 'Redeem'}
        </Button>
    )
}
