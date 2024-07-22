'use client'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { users } from '@/drizzle/schema'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { InferSelectModel } from 'drizzle-orm'
import { Check, ChevronsUpDown, Loader } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { getCityByName, updateUserProfile } from './actions'
import { profileSchema, ProfileValues } from './edit-profile-schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function EditProfileDialog({
    user,
    trigger,
}: {
    user: Pick<
        InferSelectModel<typeof users>,
        'bio' | 'name' | 'username' | 'location'
    >
    trigger: ReactNode
}) {
    const [open, setOpen] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { isValid, isSubmitting, errors },
    } = useForm<ProfileValues>({
        defaultValues: {
            bio: user.bio || '',
            name: user.name || '',
            username: user.username || '',
            location: user.location || '',
        },
        resolver: zodResolver(profileSchema),
        mode: 'onSubmit',
    })

    const onSubmit = async (data: ProfileValues) => {
        const error = await updateUserProfile(data)
        if (error === 'Username not available') {
            setError('username', { message: error })
            return
        }
        if (error) {
            setError('root', { message: error })
            return
        }
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                if (open) reset()
                setOpen(open)
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            {...register('username')}
                            id="username"
                            className="col-span-3"
                            placeholder="Type here..."
                        />
                    </div>
                    {!!errors.username?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.username.message}
                        </p>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            {...register('name')}
                            id="name"
                            className="col-span-3"
                            placeholder="Type here..."
                        />
                    </div>
                    {!!errors.name?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.name.message}
                        </p>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location">Location</Label>
                        <div className="col-span-3">
                            <LocationCombobox
                                value={watch('location') || undefined}
                                setValue={(val) => setValue('location', val)}
                            />
                        </div>
                    </div>
                    {!!errors.location?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.location.message}
                        </p>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            {...register('bio')}
                            id="bio"
                            className="col-span-3"
                            maxLength={150}
                            placeholder="Type here..."
                        />
                    </div>
                    {!!errors.bio?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.bio.message}
                        </p>
                    )}
                    {!!errors.root?.message && (
                        <p className="text-right text-destructive text-sm">
                            {errors.root.message}
                        </p>
                    )}
                    <div className="flex gap-1 justify-end mt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button disabled={isSubmitting} type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function LocationCombobox({
    value,
    setValue,
}: {
    value?: string
    setValue: (value: string) => void
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const { data, isFetching, isError } = useQuery<string[]>({
        queryFn: async () => getCityByName(search),
        queryKey: ['locations', search],
        enabled: search.length >= 3,
        initialData: [],
        placeholderData: [],
    })

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full"
                >
                    {value || 'Select city...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        id="location"
                        onValueChange={(search) => setSearch(search)}
                        placeholder="Search city..."
                    />
                    <CommandEmpty>
                        {isFetching ? (
                            <div className="flex justify-center">
                                <Loader className="animate-spin h-4 w-4" />
                            </div>
                        ) : isError ? (
                            <p>An error occured</p>
                        ) : search.length < 3 ? (
                            <p>Type more to search</p>
                        ) : (
                            <p>No results found</p>
                        )}
                    </CommandEmpty>
                    <CommandList>
                        {data?.map((cityName) => (
                            <CommandItem
                                onSelect={(newValue) => {
                                    setValue(newValue === value ? '' : newValue)
                                    setOpen(false)
                                }}
                                key={cityName}
                                value={cityName}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value === cityName
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                {cityName}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
