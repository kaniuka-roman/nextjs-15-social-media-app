import prisma from '@/lib/prisma'
import { getCommentDataInclude } from './queries'
import { PaginationParams } from './types'

export type CommentData = Awaited<ReturnType<typeof getComments>>[number]

export const createComment = async ({
   content,
   postId,
   authorId,
   postAuthorId,
}: {
   content: string
   postId: string
   authorId: string
   postAuthorId: string
}) => {
   return await prisma.$transaction([
      prisma.comment.create({
         data: {
            content,
            postId,
            userId: authorId,
         },
         include: getCommentDataInclude(authorId),
      }),
      ...(postAuthorId !== authorId
         ? [
              prisma.notification.create({
                 data: {
                    issuerId: authorId,
                    recipientId: postAuthorId,
                    postId,
                    type: 'COMMENT',
                 },
              }),
           ]
         : []),
   ])
}

export const getComments = async ({
   postId,
   userId,
   cursor,
   pageSize,
}: {
   postId: string
   userId: string
} & PaginationParams) => {
   return await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(userId),
      orderBy: { createdAt: 'asc' },
      take: -pageSize,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
   })
}
