'use server'

import { validateRequest } from '@/auth'
import { createComment } from '@/controllers/comments'
import { PostType } from '@/controllers/posts'
import { getCommentDataInclude } from '@/controllers/queries'
import prisma from '@/lib/prisma'
import { createCommentSchema } from '@/lib/validation'

export const submitComment = async ({ post, content }: { post: PostType; content: string }) => {
   const { user } = await validateRequest()
   if (!user) throw new Error('Unauthorized')
   const { content: validatedContent } = createCommentSchema.parse({ content })

   const newComment = await createComment({ content: validatedContent, authorId: user.id, postId: post.id })
   return newComment
}

export const deleteComment = async (id: string) => {
   const { user } = await validateRequest()
   if (!user) throw new Error('Unauthorized')
   const comment = await prisma.comment.findUnique({ where: { id } })
   if (!comment) throw new Error('Comment not found')
   if (comment.userId !== user.id) throw new Error('Unauthorized')
   const deletedComment = await prisma.comment.delete({ where: { id }, include: getCommentDataInclude(user.id) })
   return deletedComment
}
