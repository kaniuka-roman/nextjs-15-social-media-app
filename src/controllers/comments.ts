import prisma from '@/lib/prisma'
import { getCommentDataInclude } from './queries'

export type CommentData = Awaited<ReturnType<typeof getComments>>[number]

export const createComment = async ({
   content,
   postId,
   authorId,
}: {
   content: string
   postId: string
   authorId: string
}) => {
   return await prisma.comment.create({
      data: {
         content,
         postId,
         userId: authorId,
      },
      include: getCommentDataInclude(authorId),
   })
}

export const getComments = async ({
   postId,
   userId,
   cursor,
   pageSize,
}: {
   postId: string
   userId: string
   pageSize: number
   cursor: string | null
}) => {
   return await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(userId),
      orderBy: { createdAt: 'asc' },
      take: -pageSize ?? undefined,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
   })
}
