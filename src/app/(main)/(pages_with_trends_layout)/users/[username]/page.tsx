import { cache } from 'react'
import { getUser as getUserData } from '@/controllers/users'
import { notFound } from 'next/navigation'
import { validateRequest } from '@/auth'
import { Metadata } from 'next'
import { UserProfile } from './UserProfile'
import { UserPosts } from './UserPosts'

type PageProps = {
   params: { username: string }
}
const getUser = cache(async (username: string, loggedInUserId: string) => {
   const user = await getUserData(username, loggedInUserId)
   if (!user) return notFound()
   return user
})

export const generateMetadata = async ({ params: { username } }: PageProps): Promise<Metadata> => {
   const { user: loggedInUser } = await validateRequest()
   if (!loggedInUser) return {}

   const user = await getUser(username, loggedInUser.id)

   return {
      title: `${user?.displayName} (@${user?.username})`,
   }
}
export default async function Page({ params: { username } }: PageProps) {
   const { user: loggedInUser } = await validateRequest()
   if (!loggedInUser) return <p className="text-destructive">{"You're not authorized to view this oage"}</p>
   const user = await getUser(username, loggedInUser.id)
   return (
      <main className="flex w-full min-w-0 gap-5">
         <div className="w-full min-w-0 space-y-5">
            <UserProfile user={user} loggedInUserId={loggedInUser.id} />
            <div className="rounded-2xl bg-card p-5 shadow-sm">
               <h2 className="text-center text-2xl font-bold">{user.displayName}&apos;s posts</h2>
            </div>
            <UserPosts userId={user.id} />
         </div>
      </main>
   )
}
