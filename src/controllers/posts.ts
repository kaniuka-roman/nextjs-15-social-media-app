import prisma from '@/lib/prisma'
export type PostType = Awaited<ReturnType<typeof getPostsWithUserData>>[number]
type GetPostsWithUserDataParams = {
   pageSize: number
   cursor: string | null
}
type UserId = { userId: string }
type GetUserPosts = Partial<GetPostsWithUserDataParams> & UserId
type GetPostsFollowedUsersParams = Partial<GetPostsWithUserDataParams> & UserId
type CreateNewPostParams = {
   content: string
   userId: string
}
const postDataInclude = {
   user: {
      select: {
         username: true,
         displayName: true,
         avatarUrl: true,
      },
   },
}
export const getPostsWithUserData = async (params?: GetPostsWithUserDataParams) => {
   const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: postDataInclude,
      take: params?.pageSize ?? undefined,
      skip: params?.cursor ? 1 : 0,
      cursor: params?.cursor ? { id: params?.cursor } : undefined,
   })
   return posts
}
export const getUserPosts = async (params: GetUserPosts) => {
   console.log('getUserPosts ~ params:', params)
   const posts = await prisma.post.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: 'desc' },
      include: postDataInclude,
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
      include: postDataInclude,
      orderBy: { createdAt: 'desc' },
      take: params.pageSize ?? undefined,
      skip: params.cursor ? 1 : 0,
      cursor: params.cursor ? { id: params.cursor } : undefined,
   })
   return posts
}

export const createNewPost = async (data: CreateNewPostParams) => {
   return await prisma.post.create({
      data,
      include: postDataInclude,
   })
}
export const deletePost = async ({ id }: { id: string }) => {
   return await prisma.post.delete({
      where: { id },
      include: postDataInclude,
   })
}
