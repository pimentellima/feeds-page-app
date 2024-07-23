'use client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import {
    CircleUserIcon,
    Columns2Icon,
    Columns3Icon,
    GridIcon,
    SquareEqualIcon,
} from 'lucide-react'
import { updateGridSize } from './actions'

export function ChangeGridDropdown({ selectedSize }: { selectedSize: number }) {
    const { toast } = useToast()

    const handleChangeGrid = async (gridSize: number) => {
        const error = await updateGridSize(gridSize)
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
                    <GridIcon className="mr-1 h-4 w-4" /> Grid size
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuCheckboxItem
                        checked={selectedSize === 1}
                        onClick={() => handleChangeGrid(1)}
                    >
                        <SquareEqualIcon className="mr-2 h-4 w-4" />
                        <span>1 column</span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={selectedSize === 2}
                        onClick={() => handleChangeGrid(2)}
                    >
                        <Columns2Icon className="mr-2 h-4 w-4" />
                        <span>2 columns</span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={selectedSize === 3}
                        onClick={() => handleChangeGrid(3)}
                    >
                        <Columns3Icon className="mr-2 h-4 w-4" />
                        <span>3 columns</span>
                    </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
