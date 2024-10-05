import { Metadata } from 'next'
import { LoginForm } from './LoginForm'
import Link from 'next/link'
import loginImage from '@/assets/login-image.jpg'
import Image from 'next/image'

export const metadata: Metadata = {
   title: 'Login',
}

const Page = () => {
   return (
      <main className='flex h-screen items-center justify-center p-5'>
         <div className='flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl'>
            <div className='w-full space-y-10 overflow-y-auto p-10 md:w-1/2'>
               <h1 className='text-center text-3xl font-bold'>Login to bugbook</h1>
               <div className='space-y-5'>
                  <LoginForm />
                  <Link href='/signup' className='mx-auto block w-fit text-center hover:underline'>
                     Don&apos;t have an account? Sign up
                  </Link>
               </div>
            </div>
            <Image src={loginImage} alt='' className='hidden w-1/2 object-cover md:block' />
         </div>
      </main>
   )
}

export default Page
