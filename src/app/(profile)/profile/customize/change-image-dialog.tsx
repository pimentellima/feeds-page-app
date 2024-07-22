'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { CameraIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { removeUserImage, updateUserImage } from './actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserAvatar from '@/components/user-avatar'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function ChangeImageDialog({ imageUrl }: { imageUrl?: string }) {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string>()
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <button
                    className="relative flex justify-center items-center group"
                    title="Change image"
                >
                    <div className="group-hover:opacity-60 transition-opacity">
                        <UserAvatar imageUrl={imageUrl} />
                    </div>
                    <div
                        className="group-hover:opacity-100 bg-opacity-50
                            absolute bg-black opacity-0 p-2 rounded-full"
                    >
                        <CameraIcon className="h-10 w-10" />
                    </div>
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
                    {imageUrl || previewUrl ? (
                        <Image
                            className="h-48 w-48 rounded-full"
                            height={200}
                            width={200}
                            src={previewUrl || imageUrl || ''}
                            alt="profile image"
                        />
                    ) : null}
                    <Button className="my-3" variant="link" asChild>
                        <Label htmlFor="file">
                            {previewUrl
                                ? 'Choose different image'
                                : 'Browse image'}
                        </Label>
                    </Button>

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
                        {imageUrl && (
                            <Button
                                onClick={async () => {
                                    const error = await removeUserImage()
                                    if (error) {
                                        setError(error)
                                        return
                                    }
                                    setOpen(false)
                                }}
                                variant={'destructive'}
                            >
                                Remove image
                            </Button>
                        )}
                        <SubmitButton disabled={!previewUrl} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
    const status = useFormStatus()
    return (
        <Button disabled={status.pending || disabled} type="submit">
            Save
        </Button>
    )
}
