'use client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import {
    AlertCircleIcon,
    Columns2Icon,
    Columns3Icon,
    LayoutIcon,
    NewspaperIcon,
    SquareEqualIcon,
} from 'lucide-react'
import { updateLayout } from './actions'
import { InferSelectModel } from 'drizzle-orm'
import { users } from '@/drizzle/schema'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

export function DropdownEditPageLayout({
    layout,
}: {
    layout: InferSelectModel<typeof users>['layout']
}) {
    const { toast } = useToast()

    const handleChangeGrid = async (
        layout: InferSelectModel<typeof users>['layout']
    ) => {
        const error = await updateLayout(layout)
        if (error) {
            toast({
                title: 'Error updating theme',
                variant: 'destructive',
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <LayoutIcon className="mr-1 h-4 w-4" />
                    <span className="hidden sm:block">Layout</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className='flex items-center'>
                        Widget grid
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <AlertCircleIcon className="ml-2 h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='text-wrap'>
                                        In mobile devices, grid view is limited
                                        to 1 column.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={layout === 'grid1x1'}
                        onClick={() => handleChangeGrid('grid1x1')}
                    >
                        <SquareEqualIcon className="mr-2 h-4 w-4" />
                        <span>1 column</span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={layout === 'grid2x2'}
                        onClick={() => handleChangeGrid('grid2x2')}
                    >
                        <Columns2Icon className="mr-2 h-4 w-4" />
                        <span>2 columns</span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={layout === 'grid3x3'}
                        onClick={() => handleChangeGrid('grid3x3')}
                    >
                        <Columns3Icon className="mr-2 h-4 w-4" />
                        <span>3 columns</span>
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>List</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={layout === 'list'}
                        onClick={() => handleChangeGrid('list')}
                    >
                        <NewspaperIcon className="mr-1 h-4 w-4" /> Timeline
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
