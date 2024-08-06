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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FormValues, schema } from './schema'
import { FloatingLabelInput } from '@/components/ui/floating-input'

export default function SignInForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { isValid, isSubmitting, errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
    })

    const router = useRouter()
    const onSubmit = async (data: FormValues) => {
        const response = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        })
        if (response?.error) {
            setError('root', { message: 'Invalid email or password' })
            return
        }
        router.push('/profile/customize')
    }

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle className="text-2xl">Welcome back!</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
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
                        Sign in
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="block text-right">
                <Link
                    className="text-sm font-medium tracking-tight
                    leading-none hover:underline underline-offset-4 text-foreground"
                    href={'/sign-up'}
                >
                    Doesn't have an account? Sign up
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
            </CardFooter>
        </Card>
    )
}
