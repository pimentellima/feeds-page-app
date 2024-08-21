'use client'

import GoogleIcon from '@/components/google-icon'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { FloatingLabelInput } from '@/components/ui/floating-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { signup } from './actions'
import { FormValues, schema } from './schema'
import FacebookIcon from '@/components/facebook-icon'

export default function SignUpForm({ username = '' }: { username?: string }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            password: '',
            username,
        },
    })

    const onSubmit = async (data: FormValues) => {
        const error = await signup(data)
        if (error) {
            return setError('root', { message: error })
        }
        await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: true,
            callbackUrl: '/profile/customize',
        })
    }

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle className="text-2xl">Join Feed Page</CardTitle>
                <CardDescription>Sign up for free</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <FloatingLabelInput
                        id="email"
                        label="Email"
                        {...register('email')}
                    />
                    {!!errors.email?.message && (
                        <p className="text-destructive text-sm">
                            {errors.email.message}
                        </p>
                    )}
                    <FloatingLabelInput
                        id="password"
                        type="password"
                        label="Password"
                        {...register('password')}
                    />
                    {!!errors.password?.message && (
                        <p className="text-destructive text-sm">
                            {errors.password.message}
                        </p>
                    )}
                    {!!errors.root?.message && (
                        <p className="text-destructive text-sm">
                            {errors.root.message}
                        </p>
                    )}
                    <Button disabled={isSubmitting} type="submit">
                        Sign in with Email
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="block text-right">
                <Link
                    className="text-sm font-medium tracking-tight
            leading-none hover:underline underline-offset-4"
                    href={'/sign-in'}
                >
                    Already created an account? Sign in
                </Link>
                <div
                    className="flex gap-1 items-center text-center font-medium text-sm 
        tracking-tight leading-none py-2"
                >
                    <div className="h-[1px] w-full bg-border" />
                    <p className="">or</p>
                    <div className="h-[1px] w-full bg-border" />
                </div>
                <Button
                    size={'lg'}
                    onClick={() => signIn('google')}
                    className="w-full mt-2"
                >
                    <GoogleIcon className="w-5 h-5 mr-2" />
                    Sign in with Google
                </Button>
                <Button
                    size={'lg'}
                    onClick={() => signIn('facebook')}
                    className="w-full mt-2"
                >
                    <FacebookIcon className="w-5 h-5 mr-2" />
                    Sign in with Facebook
                </Button>
            </CardFooter>
        </Card>
    )
}
