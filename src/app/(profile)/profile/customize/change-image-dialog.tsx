'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateUserImage } from './actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserAvatar from '@/components/user-avatar'

export default function ChangeImageDialog({ imageUrl }: { imageUrl?: string }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string>()
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <button title='Change image'>
                    <UserAvatar imageUrl={imageUrl} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change image</DialogTitle>
                </DialogHeader>
                <form
                    className="flex flex-col items-center"
                    action={async (data) => {
                        const error = await updateUserImage(data)
                        if (error) {
                            setError(error)
                            return
                        }
                        setOpen(false)
                    }}
                >
                    <input
                        id="file"
                        onChange={(e) => {
                            if (e.target.files?.length) {
                                setPreviewUrl(
                                    URL.createObjectURL(e.target.files[0])
                                )
                            }
                        }}
                        className="hidden"
                        name="file"
                        type="file"
                    />
                    <label htmlFor="file">
                        {imageUrl || previewUrl ? (
                            <Image
                                className="h-48 w-48 rounded-full"
                                height={200}
                                width={200}
                                src={previewUrl || imageUrl || ''}
                                alt="profile image"
                            />
                        ) : (
                            <UserIcon className="h-48 w-48 rounded-full" />
                        )}
                    </label>
                    {!!error && (
                        <p className="text-destructive text-sm mt-3">{error}</p>
                    )}
                    <div className="mt-3 flex gap-1 justify-center">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            variant={'outline'}
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
