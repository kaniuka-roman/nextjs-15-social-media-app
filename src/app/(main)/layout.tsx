import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import SessionProvider from './SessionProvider'
import Navbar from './Navbar'
import { MenuBar } from './MenuBar'

const Layout = async ({ children }: { children: ReactNode }) => {
   const session = await validateRequest()
   if (!session.user) redirect('/login')
   return (
      <SessionProvider value={session}>
         <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="mx-auto max-w-7xl p-5 flex w-full grow gap-5">
               <MenuBar className="sticky top-[5.25rem] h-fit hidden sm:block space-y-3 rounded-2xl bg-card px-3 py-5 lg:px-5 shadow-sm xl:w-80 flex-none" />
               {children}
            </div>
            <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden shrink-0" />
         </div>
      </SessionProvider>
   )
}

export default Layout
