'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { users } from '@/drizzle/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { InferSelectModel } from 'drizzle-orm'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateUserProfile } from './actions'
import { profileSchema, ProfileValues } from './profile-schema'

export default function DialogEditProfile({
    user,
    trigger,
}: {
    user: Pick<InferSelectModel<typeof users>, 'bio' | 'name' | 'username'>
    trigger: ReactNode
}) {
    const [open, setOpen] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { isValid, isSubmitting, errors },
    } = useForm<ProfileValues>({
        defaultValues: {
            bio: user.bio || '',
            name: user.name || '',
            username: user.username || '',
        },
        resolver: zodResolver(profileSchema),
        mode: 'onSubmit',
    })

    const onSubmit = async (data: ProfileValues) => {
        const error = await updateUserProfile(data)
        if (error === 'Username not available') {
            setError('username', { message: error })
            return
        }
        if (error) {
            setError('root', { message: error })
            return
        }
        reset(data)
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (open) reset()
                setOpen(open)
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            {...register('username')}
                            id="username"
                            className="col-span-3"
                            placeholder="Type here..."
                        />
                    </div>
                    {!!errors.username?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.username.message}
                        </p>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            {...register('name')}
                            id="name"
                            className="col-span-3"
                            placeholder="Type here..."
                        />
                    </div>
                    {!!errors.name?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.name.message}
                        </p>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            {...register('bio')}
                            id="bio"
                            className="col-span-3"
                            maxLength={150}
                            placeholder="Type here..."
                        />
                    </div>
                    {!!errors.bio?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.bio.message}
                        </p>
                    )}
                    {!!errors.root?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.root.message}
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
                        <Button disabled={isSubmitting} type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}