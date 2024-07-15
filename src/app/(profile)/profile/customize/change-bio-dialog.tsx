'use client'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PencilIcon } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'
import { changeUserBio } from './actions'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function ChangeBioDialog({ bio }: { bio?: string }) {
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger>
                <PencilIcon className="h-5 w-5" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change bio</DialogTitle>
                </DialogHeader>
                <form
                    action={async (formData) => {
                        const error = await changeUserBio(formData)
                        if (error) {
                            setError(error)
                            return
                        }
                        setOpen(false)
                    }}
                >
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                            defaultValue={bio}
                            name="bio"
                            id="bio"
                            maxLength={50}
                            placeholder="Type here..."
                        />
                        {!!error && (
                            <p className="text-right text-destructive text-sm">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-1 justify-end mt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <SubmitButton />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function SubmitButton() {
    const status = useFormStatus()
    return (
        <Button disabled={status.pending} type="submit">
            Submit
        </Button>
    )
}
