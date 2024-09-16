'use server'
import { validateRequest } from '@/auth'
import { deletePost } from '@/controllers/posts'
import prisma from '@/lib/prisma'

export const deletePostAction = async (id: string) => {
   const { user } = await validateRequest()
   if (!user) throw new Error('Unauthorized')
   const post = await prisma.post.findUnique({
      where: { id },
   })
   if (!post) throw new Error('Post not found')
   if (post.userId !== user.id) throw new Error('Unauthorized')
   const deletedPost = await deletePost({ id })
   return deletedPost
}
export { deletePost }
