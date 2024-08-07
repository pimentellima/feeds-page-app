'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

import { EllipsisIcon, LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { deleteWidget } from './actions'

export default function PopoverDeleteWidget({
    label = 'Delete widget',
    id,
}: {
    label?: string
    id: string
}) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={(open) => setOpen(open)}>
            <PopoverTrigger>
                <EllipsisIcon className="text-foreground h-5 w-5" />
            </PopoverTrigger>
            <PopoverContent className="w-min">
                <Button
                    disabled={loading}
                    variant={'destructive'}
                    className="flex gap-1 items-center"
                    onClick={async () => {
                        try {
                            setLoading(true)
                            const error = await deleteWidget(id)
                            if (error)
                                toast({
                                    title: 'An error occurred while deleting the item.',
                                    description: error,
                                    variant: 'destructive',
                                })
                            setOpen(false)
                        } catch (e) {
                            toast({
                                title: 'An error occurred while deleting the item.',
                                variant: 'destructive',
                            })
                        } finally {
                            setLoading(false)
                        }
                    }}
                >
                    {loading && <LoaderIcon className="h-4 w-4 animate-spin" />}
                    {label}
                </Button>
            </PopoverContent>
        </Popover>
    )
}
