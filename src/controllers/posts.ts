import prisma from '@/lib/prisma'
import { getPostDataInclude } from './queries'
export type PostType = Awaited<ReturnType<typeof getPosts>>[number]
export type GetSinglePost = { postId: string; userId: string }
type GetPostsParams = {
   pageSize: number
   cursor: string | null
} & UserId
type UserId = { userId: string }

type GetUserPosts = Partial<GetPostsParams> & UserId
type GetPostsFollowedUsersParams = Partial<GetPostsParams> & UserId
type CreateNewPostParams = {
   content: string
   userId: string
   mediaIds: string[]
}

export const getPosts = async (params: GetPostsParams) => {
   const posts = await prisma.post.findMany({
      include: getPostDataInclude(params.userId),
      orderBy: { createdAt: 'desc' },
      take: params?.pageSize ?? undefined,
      skip: params?.cursor ? 1 : 0,
      cursor: params?.cursor ? { id: params?.cursor } : undefined,
   })
   return posts
}
export const getUserPosts = async (params: GetUserPosts) => {
   const posts = await prisma.post.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: 'desc' },
      include: getPostDataInclude(params.userId),
      take: params?.pageSize ?? undefined,
      skip: params?.cursor ? 1 : 0,
      cursor: params?.cursor ? { id: params?.cursor } : undefined,
   })
   return posts
}
export const getPostsFollowedUsers = async (params: GetPostsFollowedUsersParams) => {
   const posts = await prisma.post.findMany({
      where: {
         user: {
            followers: {
               some: {
                  followerId: params.userId,
               },
            },
         },
      },
      include: getPostDataInclude(params.userId),
      orderBy: { createdAt: 'desc' },
      take: params.pageSize ?? undefined,
      skip: params.cursor ? 1 : 0,
      cursor: params.cursor ? { id: params.cursor } : undefined,
   })
   return posts
}
export const getSinglePost = async ({ postId, userId }: GetSinglePost) => {
   const post = await prisma.post.findUnique({
      where: {
         id: postId,
      },
      include: getPostDataInclude(userId),
   })
   return post
}

export const createNewPost = async ({ content, userId, mediaIds }: CreateNewPostParams) => {
   return await prisma.post.create({
      data: {
         content,
         userId,
         attachments: {
            connect: mediaIds.map((id) => ({ id })),
         },
      },
      include: getPostDataInclude(userId),
   })
}
export const deletePost = async ({ id }: { id: string }) => {
   return await prisma.post.delete({
      where: { id },
      select: {
         id: true,
      },
   })
}

export const getPostLikes = async ({ postId, userId }: GetSinglePost) => {
   return await prisma.post.findUnique({
      where: { id: postId },
      select: {
         likes: {
            where: {
               userId,
            },
            select: {
               userId: true,
            },
         },
         _count: {
            select: {
               likes: true,
            },
         },
      },
   })
}
export const likePost = async ({ postId, userId }: { postId: string; userId: string }) => {
   return await prisma.like.upsert({
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
export const unlikePost = async ({ postId, userId }: { postId: string; userId: string }) => {
   return await prisma.like.deleteMany({
      where: {
         postId,
         userId,
      },
   })
}
