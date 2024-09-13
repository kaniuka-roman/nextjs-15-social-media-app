import { Metadata } from 'next'
import signupImage from '@/assets/signup-image.jpg'
import Image from 'next/image'
import Link from 'next/link'
import { SignUpForm } from './SignUpForm'

export const metadata: Metadata = {
   title: 'Sign Up',
}

const Page = () => {
   return (
      <main className="flex h-screen items-center justify-center p-5">
         <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card shadow-2xl">
            <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-5">
               <div className="space-y-10 text-center">
                  <h1 className="text-3xl font-bold">Sign up to bugbook</h1>
                  <p className="text-muted-foreground">
                     A place where even <span className="italic">you</span> can find a friend.
                  </p>
               </div>
               <div className="space-y-5">
                  <SignUpForm />
                  <Link href="/login" className="block mx-auto w-fit text-center hover:underline">
                     Already have an account? Log in
                  </Link>
               </div>
            </div>
            <Image src={signupImage} alt="" className="w-1/2 hidden md:block object-cover" />
         </div>
      </main>
   )
}
export default Page
