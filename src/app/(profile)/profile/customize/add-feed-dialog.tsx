'use client'
import TiktokIcon from '@/components/tiktok-icon'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    InstagramIcon,
    LoaderIcon,
    PlusIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { addIntegration as addFeedIntegration } from './actions'

type IntegrationType = 'youtube' | 'instagram' | 'x' | 'tiktok' | ''

export default function AddFeedDialog() {
    const [open, setOpen] = useState(false)

    const {
        setError,
        handleSubmit,
        register,
        setValue,
        reset,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<{ type: IntegrationType }>({
        defaultValues: {
            type: '',
        },
    })

    const onSubmit = async (values: { type: IntegrationType }) => {
        if (!values.type) return
        const error = await addFeedIntegration(values.type)
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
                if (open) {
                    reset()
                }
            }}
            open={open}
        >
            <DialogTrigger asChild>
                <Button variant={'secondary'}>
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add feed
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add feed</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <Select
                        value={watch('type')}
                        onValueChange={(value) => {
                            setValue('type', value as IntegrationType)
                            clearErrors()
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="youtube">
                                <p className="flex items-center gap-1">
                                    <YoutubeIcon className="text-red-500 w-5 h-5" />
                                    Youtube
                                </p>
                            </SelectItem>
                            <SelectItem value="instagram">
                                <p className="flex items-center gap-1">
                                    <InstagramIcon className="text-pink-500 h-5 w-5" />
                                    Instagram
                                </p>
                            </SelectItem>
                            <SelectItem value="tiktok">
                                <p className="flex items-center gap-1">
                                    <TiktokIcon className="fill-foreground h-5 w-5" />
                                    Tiktok
                                </p>
                            </SelectItem>
                            <SelectItem disabled value="x">
                                <p className="flex items-center gap-1">
                                    <XIcon className="text-foreground h-5 w-5" />
                                    X (Coming soon)
                                </p>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {!!errors.root && (
                        <p className="mt-1 text-destructive text-sm">
                            {errors.root.message}
                        </p>
                    )}
                    <div className="flex justify-end gap-1">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            variant={'outline'}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex gap-1 items-center"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting && (
                                <LoaderIcon className="h-4 w-4 animate-spin" />
                            )}
                            Add feed
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
