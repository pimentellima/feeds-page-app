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
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { InferSelectModel } from 'drizzle-orm'
import { users } from '@/drizzle/schema'
import { Textarea } from '@/components/ui/textarea'
import { updateUsernameAndBio } from './actions'

export default function EditProfileDialog({
    user,
}: {
    user: Pick<InferSelectModel<typeof users>, 'bio' | 'username'>
}) {
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger>
                <div
                    className="mt-1 rounded-md font-medium group transition-colors
                        px-4 py-2 max-w-96"
                >
                    <p className="group-hover:underline underline-offset-4 w-full">
                        {user.username || 'No username'}
                    </p>
                    <p className="group-hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                        {user.bio || 'No bio'}
                    </p>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit username and bio</DialogTitle>
                </DialogHeader>
                <form
                    className="grid gap-4"
                    action={async (formData) => {
                        const error = await updateUsernameAndBio(formData)
                        if (error) {
                            setError(error)
                            return
                        }
                        setOpen(false)
                        setError('')
                    }}
                >
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            defaultValue={user.username || ''}
                            name="username"
                            id="username"
                            maxLength={25}
                            placeholder="Type here..."
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            defaultValue={user.bio || ''}
                            name="bio"
                            id="bio"
                            maxLength={150}
                            placeholder="Type here..."
                        />
                    </div>
                    {!!error && (
                        <p className="text-right text-destructive text-sm">
                            {error}
                        </p>
                    )}
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
            Save
        </Button>
    )
}
