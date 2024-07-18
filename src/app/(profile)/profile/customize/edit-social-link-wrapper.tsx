'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { ReactNode, useState } from 'react'
import AddLinkForm from './add-link-form'
import { Button } from '@/components/ui/button'
import { InferSelectModel } from 'drizzle-orm'
import { links } from '@/drizzle/schema'

export function EditSocialLinkWrapper({
    children,
    link,
}: {
    children: ReactNode
    link: InferSelectModel<typeof links>
}) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)

    return (
        <Dialog
            open={linkDialogOpen}
            onOpenChange={(open) => setLinkDialogOpen(open)}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-card hover:bg-card flex flex-col h-full gap-1 items-center"
                >
                    {children}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add social link</DialogTitle>
                </DialogHeader>
                <AddLinkForm
                    link={link}
                    onCancelForm={() => setLinkDialogOpen(false)}
                    onSubmitForm={() => setLinkDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
