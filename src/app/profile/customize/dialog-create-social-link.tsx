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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { socialLinks } from '@/drizzle/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { InferSelectModel } from 'drizzle-orm'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSocialLink, deleteSocialLink } from './actions'
import { SocialLinkIcon } from '../../../components/social-icons'
import { schema, SocialLinkValues } from './social-link-schema'

export function DialogCreateSocialLink({
    socialLink,
    userLinks,
}: {
    socialLink?: InferSelectModel<typeof socialLinks>
    userLinks: InferSelectModel<typeof socialLinks>[]
}) {
    const { toast } = useToast()
    const [open, setOpen] = useState<boolean>(false)

    const defaultValues = {
        id: socialLink?.id || undefined,
        type: socialLink?.type || undefined,
        url: socialLink?.url || '',
    }
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { isValid, isSubmitting, errors },
    } = useForm<SocialLinkValues>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: 'onSubmit',
    })

    const onSubmit = async (data: SocialLinkValues) => {
        const error = await createSocialLink(data)
        if (error) {
            setError('root', { message: error })
            return
        }
        data.id ? reset(data) : reset(defaultValues)
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open)
            }}
        >
            <DialogTrigger asChild>
                <Button
                    title={socialLink ? 'Edit link' : 'Add link'}
                    variant="ghost"
                >
                    {socialLink?.type ? (
                        <SocialLinkIcon
                            className="sm:h-6 sm:w-6 h-5 w-5"
                            linkType={socialLink.type}
                        />
                    ) : (
                        <PlusIcon className="sm:h-6 sm:w-6 h-5 w-5 text-foreground" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {socialLink ? 'Edit link' : 'Add link'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label>Type</Label>
                        <div className="col-span-3">
                            <SelectSocialLinkField
                                userLinks={userLinks}
                                value={watch('type')}
                                setValue={(value) =>
                                    setValue(
                                        'type',
                                        value as InferSelectModel<
                                            typeof socialLinks
                                        >['type']
                                    )
                                }
                            />
                        </div>
                        {!!errors.type?.message && (
                            <p className="text-destructive text-sm">
                                {errors.type.message}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url">Url</Label>
                        <Input
                            className="col-span-3"
                            placeholder="example@123.com"
                            {...register('url')}
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
                            variant="outline"
                            onClick={() => {
                                reset(defaultValues)
                                setOpen(false)
                            }}
                            type="button"
                        >
                            Cancel
                        </Button>
                        {socialLink && (
                            <Button
                                variant={'destructive'}
                                onClick={async () => {
                                    const error = await deleteSocialLink(
                                        socialLink.id
                                    )
                                    if (error) {
                                        toast({
                                            variant: 'destructive',
                                            title: 'Error deleting social link',
                                        })
                                        return
                                    }
                                    reset(defaultValues)
                                    setOpen(false)
                                }}
                                type="button"
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

function SelectSocialLinkField({
    value,
    setValue,
    userLinks,
}: {
    value: string
    setValue: (value: string) => void
    userLinks: InferSelectModel<typeof socialLinks>[]
}) {
    return (
        <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a link type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'tiktok')}
                    value="tiktok"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="tiktok" />
                        Tiktok
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'instagram')}
                    value="instagram"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="instagram" />
                        Instagram
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'x')}
                    value="x"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="x" />X
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'linkedin')}
                    value="linkedin"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="linkedin" />
                        LinkedIn
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'github')}
                    value="github"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="github" />
                        Github
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'youtube')}
                    value="youtube"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="youtube" />
                        Youtube
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'twitch')}
                    value="twitch"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="twitch" />
                        Twitch
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'facebook')}
                    value="facebook"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="facebook" />
                        Facebook
                    </div>
                </SelectItem>
                <SelectItem
                    disabled={userLinks.some((l) => l.type === 'website')}
                    value="website"
                >
                    <div className="flex items-center gap-2">
                        <SocialLinkIcon linkType="website" />
                        Website
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
