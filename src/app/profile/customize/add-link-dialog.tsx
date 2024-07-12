'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { addUserLink, deleteUserLink } from './actions'
import { linkSchema, LinkValues } from './schema'
import { InferSelectModel } from 'drizzle-orm'
import { userLinks } from '@/drizzle/schema'

export default function AddLinkDialog({
    link,
    children,
}: {
    link?: InferSelectModel<typeof userLinks>
    children?: ReactNode
}) {
    const [open, setOpen] = useState(false)
    const {
        handleSubmit,
        register,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LinkValues>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            id: link?.id || null,
            title: link?.title || '',
            url: link?.url || '',
        },
    })

    const onSubmit = async (values: LinkValues) => {
        const error = await addUserLink(values)
        if (error) {
            setError('root', { message: error })
            return
        }
        setOpen(false)
    }

    return (
        <Dialog
            onOpenChange={(open) => {
                setOpen(open)
                if (open) reset()
            }}
            open={open}
        >
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant={'secondary'}>
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Add social link
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {link ? 'Edit social link' : 'Add social link'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            {...register('title')}
                            id="title"
                            placeholder={'Follow me at example.com!'}
                        />
                        {!!errors.title?.message && (
                            <p className="text-destructive text-sm">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="url">Url</Label>
                        <Input
                            {...register('url')}
                            id="url"
                            placeholder={'https://example.com'}
                        />
                        {!!errors.url?.message && (
                            <p className="text-destructive text-sm">
                                {errors.url.message}
                            </p>
                        )}
                    </div>
                    {!!errors.root?.message && (
                        <p className="text-destructive text-sm">
                            {errors.root.message}
                        </p>
                    )}
                    <DialogFooter className="flex justify-end gap-1">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            variant={'outline'}
                        >
                            Cancel
                        </Button>
                        {link && (
                            <Button
                                type="button"
                                onClick={async () => {
                                    try {
                                        await deleteUserLink(link?.id)
                                        setOpen(false)
                                    } catch {}
                                }}
                                variant={'destructive'}
                            >
                                Delete
                            </Button>
                        )}
                        <Button disabled={isSubmitting} type="submit">
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
