'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signup } from './actions'
import { FormValues, schema } from './schema'
import Link from 'next/link'

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
    })

    const router = useRouter()

    const onSubmit = async (data: FormValues) => {
        const error = await signup(data)
        if (error) {
            return setError('root', { message: error })
        }
        router.push('/sign-in')
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-xl">Create an account</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid items-center gap-3"
                >
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            placeholder="example@123.com"
                            {...register('email')}
                        />
                        {!!errors.email?.message && (
                            <p className="text-destructive text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            placeholder="type here..."
                            {...register('password')}
                        />
                        {!!errors.password?.message && (
                            <p className="text-destructive text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    {!!errors.root?.message && (
                        <p className="text-destructive text-sm">
                            {errors.root.message}
                        </p>
                    )}
                    <Button disabled={isSubmitting} type="submit">
                        Create account
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="block text-right">
                <Link
                    className="text-sm font-medium tracking-tight
            leading-none hover:underline underline-offset-4"
                    href={'/sign-in'}
                >
                    Already have an account? Sign in
                </Link>
                <Separator className="my-3" />
                <p
                    className="text-center font-medium text-sm 
        tracking-tight leading-none"
                >
                    Or continue with
                </p>
                <div className="flex gap-1 mt-3">
                    <Button className="w-full">Google</Button>
                    <Button className="w-full">Github</Button>
                </div>
            </CardFooter>
        </Card>
    )
}
