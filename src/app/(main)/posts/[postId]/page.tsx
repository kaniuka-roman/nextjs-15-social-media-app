import { validateRequest } from '@/auth'
import { Post } from '@/components/posts/Post'
import { getSinglePost, GetSinglePost } from '@/controllers/posts'
import { Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { cache, Suspense } from 'react'
import { UserInfoSidebar } from './components/UserInfoSidebar'

type PageProps = {
   params: { postId: string }
}

const getPost = cache(async ({ postId, userId }: GetSinglePost) => {
   const post = await getSinglePost({ postId, userId })
   if (!post) notFound()
   return post
})

export const generateMetadata = async ({ params: { postId } }: PageProps) => {
   const { user } = await validateRequest()
   if (!user) return {}
   const post = await getPost({ postId, userId: user.id })
   return {
      title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
   }
}

export default async function Page({ params: { postId } }: PageProps) {
   const { user } = await validateRequest()
   if (!user) return <p className="text-destructive">{"You're not authorized to view this page"}</p>
   const post = await getPost({ postId, userId: user.id })
   return (
      <main className="flex w-full min-w-0 gap-5">
         <div className="w-full min-w-0 space-y-5">
            <Post post={post} />
         </div>
         <div className="sticky top-[5.25rem] hidden lg:block h-fit w-80 flex-none">
            <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
               <UserInfoSidebar user={post.user} />
            </Suspense>
         </div>
      </main>
   )
}
