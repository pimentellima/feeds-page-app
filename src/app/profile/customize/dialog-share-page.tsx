'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Share2Icon } from 'lucide-react'

export default function DialogSharePage({ username }: { username: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <Share2Icon className="mr-1 h-4 w-4 text-yellow-500" />
                    <span className="hidden sm:block ">Share</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Share your page</DialogTitle>
                    <DialogDescription>
                        Copy the link to share your page with others.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <Input
                            value={process.env.NEXT_PUBLIC_URL + '/' + username}
                            readOnly
                            className="flex-1"
                        />
                        <Button
                            variant="secondary"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    process.env.NEXT_PUBLIC_URL + '/' + username
                                )
                            }}
                        >
                            Copy
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
