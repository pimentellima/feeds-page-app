'use client'
import TiktokIcon from '@/components/tiktok-icon'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import { InstagramIcon, PlusIcon, XIcon, YoutubeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type IntegrationType = 'youtube' | 'instagram' | 'x' | 'tiktok'

export default function AddIntegrationDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [error, setError] = useState('')
    const [integration, setIntegration] = useState<IntegrationType>()

    return (
        <Dialog
            onOpenChange={(open) => {
                setOpen(open)
                if (open) {
                    setIntegration(undefined)
                }
            }}
            open={open}
        >
            <DialogTrigger asChild>
                <Button variant={'secondary'}>
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add integration
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add integration</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Select
                        value={integration}
                        onValueChange={(value) =>
                            setIntegration(value as IntegrationType)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select an integration type" />
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
                            <SelectItem value="x">
                                <p className="flex items-center gap-1">
                                    <XIcon className="text-foreground h-5 w-5" />
                                    X
                                </p>
                            </SelectItem>
                            <SelectItem value="tiktok">
                                <p className="flex items-center gap-1">
                                    <TiktokIcon className="fill-foreground h-5 w-5" />
                                    Tiktok
                                </p>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {integration === 'tiktok' && (
                        <Button
                            onClick={async () => {
                                try {
                                    const res = await fetch('/api/tiktok', {
                                        method: 'POST',
                                    })
                                    const data = await res.json()
                                    const url = data.url as string
                                    router.push(url)
                                } catch {
                                    setError(
                                        'Error linking account. Please try again.'
                                    )
                                }
                            }}
                        >
                            Connect your TikTok account
                        </Button>
                    )}
                </div>
                <DialogFooter className="flex justify-end gap-1">
                    <Button
                        type="button"
                        onClick={() => setOpen(false)}
                        variant={'outline'}
                    >
                        Cancel
                    </Button>
                    <Button disabled={!integration}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
