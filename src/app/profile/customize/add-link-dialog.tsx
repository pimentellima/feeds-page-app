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
import { users } from '@/drizzle/schema'
import { DialogDescription } from '@radix-ui/react-dialog'
import { InferSelectModel } from 'drizzle-orm'
import {
    CogIcon,
    InstagramIcon,
    PlusIcon,
    XIcon,
    YoutubeIcon,
} from 'lucide-react'
import { useState } from 'react'

const urlPlaceholder = {
    youtube: 'https://www.youtube.com/@example',
    x: 'https://x.com/example',
    instagram: 'https://www.instagram.com/example',
    custom: 'https://something.com/example',
}

const titlePlaceholder = {
    youtube: 'Check my youtube channel',
    instagram: 'Follow my instagram profile',
    x: 'Follow my X account',
    custom: 'Follow me at something!',
}

type IntegrationType = 'youtube' | 'instagram' | 'x' | 'custom'

export default function AddLinkDialog({
    user,
}: {
    user: InferSelectModel<typeof users>
}) {
    const [open, setOpen] = useState(false)
    const [integration, setIntegration] = useState<IntegrationType>()
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')

    return (
        <Dialog
            onOpenChange={(open) => {
                setOpen(open)
                if (open) {
                    setTitle('')
                    setUrl('')
                    setIntegration(undefined)
                }
            }}
            open={open}
        >
            <DialogTrigger asChild>
                <Button variant={'secondary'}>
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add social link
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add social link</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4">
                    <Select
                        value={integration}
                        onValueChange={(value) =>
                            setIntegration(value as IntegrationType)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a link type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="youtube">
                                <p className="flex items-center gap-1">
                                    <YoutubeIcon
                                        color="red"
                                        className="w-5 h-5"
                                    />
                                    Youtube
                                </p>
                            </SelectItem>
                            <SelectItem value="instagram">
                                <p className="flex items-center gap-1">
                                    <InstagramIcon
                                        color="pink"
                                        className="h-5 w-5"
                                    />
                                    Instagram
                                </p>
                            </SelectItem>
                            <SelectItem value="x">
                                <p className="flex items-center gap-1">
                                    <XIcon color="white" className="h-5 w-5" />X
                                </p>
                            </SelectItem>
                            <SelectItem value="custom">
                                <p className="flex items-center gap-1">
                                    <CogIcon color="gray" className="h-5 w-5" />
                                    Custom
                                </p>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            id="title"
                            disabled={!integration}
                            placeholder={
                                integration ? titlePlaceholder[integration] : ''
                            }
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="url">Url</Label>
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            id="url"
                            disabled={!integration}
                            type="url"
                            placeholder={
                                integration ? urlPlaceholder[integration] : ''
                            }
                        />
                    </div>
                    <DialogFooter className="flex justify-end gap-1">
                        <Button
                            type="button"
                            onClick={() => setOpen(false)}
                            variant={'outline'}
                        >
                            Cancel
                        </Button>
                        <Button disabled={!url || !title}>Confirm</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
