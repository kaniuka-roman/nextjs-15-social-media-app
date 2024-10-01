import prisma from '@/lib/prisma'
import { getPostDataInclude } from './queries'

export type BookmarkParams = {
   userId: string
   postId: string
}
export type BookmarksData = Awaited<ReturnType<typeof getUserBookmarks>>[number]
type GetBookmarksWithPaginationParams = {
   pageSize: number
   cursor: string | null
   userId: string
}

export const getBookmark = async ({ postId, userId }: BookmarkParams) => {
   return await prisma.bookmark.findUnique({
      where: {
         userId_postId: {
            userId,
            postId,
         },
      },
   })
}

export const getUserBookmarks = async ({ userId, cursor, pageSize }: GetBookmarksWithPaginationParams) => {
   return await prisma.bookmark.findMany({
      where: {
         userId,
      },
      include: {
         post: {
            include: getPostDataInclude(userId),
         },
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize ?? undefined,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
   })
}

export const addPostToBookmarks = async ({ postId, userId }: BookmarkParams) => {
   return await prisma.bookmark.upsert({
      where: {
         userId_postId: {
            userId,
            postId,
         },
      },
      create: {
         userId,
         postId,
      },
      update: {},
   })
}

export const deletePostFromBookmarks = async ({ postId, userId }: BookmarkParams) => {
   return await prisma.bookmark.deleteMany({
      where: {
         postId,
         userId,
      },
   })
}
