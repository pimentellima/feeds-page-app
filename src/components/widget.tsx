import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { EllipsisIcon, Trash2Icon } from 'lucide-react'
import { ReactNode } from 'react'
import { Button } from './ui/button'

export function Widget({ children }: { children: ReactNode }) {
    return (
        <Card className="text-sm h-min hover:bg-card/70 transition-colors">
            {children}
        </Card>
    )
}

export function WidgetHeader({ children }: { children: ReactNode }) {
    return (
        <CardHeader className="grid grid-cols-3 justify-items-center place-items-center">
            {children}
        </CardHeader>
    )
}
export function WidgetTitle({ children }: { children: ReactNode }) {
    return (
        <CardTitle className="col-start-2 text-base">
            {children}
        </CardTitle>
    )
}

export function DeleteWidgetButton({ onDelete }: { onDelete: () => void }) {
    return (
        <div className="justify-self-end">
            <button title='Delete widget' onClick={onDelete}>
                <Trash2Icon className="text-foreground h-4 w-4" />
            </button>
        </div>
    )
}

export function WidgetContent({ children }: { children: ReactNode }) {
    return (
        <CardContent className="flex justify-center w-full h-96 pt-2 items-center">
            {children}
        </CardContent>
    )
}
