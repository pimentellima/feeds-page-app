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
import { PencilIcon, UserIcon } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'
import { changeUserBio, updateUserImage } from './actions'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Image from 'next/image'

export default function ChangeImageDialog({ imageUrl }: { imageUrl?: string }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string>()

    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <button>
                    {imageUrl ? (
                        <Image
                            className="h-28 w-28 rounded-full p-1"
                            height={150}
                            width={150}
                            src={imageUrl}
                            alt="profile image"
                        />
                    ) : (
                        <UserIcon className="h-28 w-28 rounded-full bg-secondary p-1" />
                    )}
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
