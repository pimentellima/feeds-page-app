'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { links } from '@/drizzle/schema'
import { getYoutubeThumbnailFromUrl } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { InferSelectModel } from 'drizzle-orm'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { linkSchema, LinkValues } from './add-link-schema'

export default function AddLinkForm({
    link,
    onSubmitForm,
    onCancelForm,
}: {
    link?: InferSelectModel<typeof links>
    onSubmitForm: (values: LinkValues) => void
    onCancelForm?: () => void
}) {
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
        link ? getYoutubeThumbnailFromUrl(link.url) : null
    )

    const {
        handleSubmit,
        register,
        reset,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm<LinkValues>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            id: link?.id || null,
            title: link?.title || '',
            url: link?.url || '',
            showThumbnail: link ? link.showThumbnail : null,
        },
    })

    useEffect(() => {
        reset({
            id: link?.id || null,
            title: link?.title || '',
            url: link?.url || '',
            showThumbnail: link ? link.showThumbnail : null,
        })
    }, [link])

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="grid gap-4">
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                    {...register('title')}
                    onChange={() => {
                        setError('root', { message: '' })
                    }}
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
                    onChange={(e) => {
                        setError('root', { message: '' })
                        const thumbnail = getYoutubeThumbnailFromUrl(
                            e.target.value
                        )
                        if (thumbnail) {
                            setThumbnailUrl(thumbnail)
                            setValue('showThumbnail', true)
                        } else {
                            setThumbnailUrl(null)
                            setValue('showThumbnail', false)
                        }
                    }}
                    id="url"
                    placeholder={'https://example.com'}
                />
                {!!errors.url?.message && (
                    <p className="text-destructive text-sm">
                        {errors.url.message}
                    </p>
                )}
            </div>
            {!!thumbnailUrl && (
                <div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="showThumbnail"
                            checked={!!watch('showThumbnail')}
                            onCheckedChange={(checked) => {
                                setValue(
                                    'showThumbnail',
                                    !!checked.valueOf() ||
                                        checked.valueOf() === 'true'
                                )
                            }}
                        />
                        <Label htmlFor="showThumbnail">Thumbnail</Label>
                    </div>
                    {watch('showThumbnail') && (
                        <Image
                            className="mt-4 rounded-md"
                            src={thumbnailUrl}
                            width={300}
                            height={300}
                            alt="Thumbnail"
                        />
                    )}
                </div>
            )}
            {!!errors.root?.message && (
                <p className="text-destructive text-sm">
                    {errors.root.message}
                </p>
            )}
            <DialogFooter className="flex justify-end gap-1">
                <Button
                    type="button"
                    onClick={() => onCancelForm?.()}
                    variant={'outline'}
                >
                    Cancel
                </Button>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    )
}
