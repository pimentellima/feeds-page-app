import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function moveItem(
    item: {
        id: string
        pos: number
    }[],
    fromPos: number,
    toPos: number
) {
    const updatedItems = [...item]

    const itemToMove = updatedItems.find((item) => item.pos === fromPos)

    if (!itemToMove) {
        return
    }

    const direction = toPos > fromPos ? 1 : -1

    updatedItems.forEach((item) => {
        if (direction === 1) {
            if (item.pos > fromPos && item.pos <= toPos) {
                item.pos -= 1
            }
        } else {
            if (item.pos < fromPos && item.pos >= toPos) {
                item.pos += 1
            }
        }
    })

    itemToMove.pos = toPos

    return updatedItems
}
