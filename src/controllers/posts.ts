import prisma from '@/lib/prisma'
export type PostType = Awaited<ReturnType<typeof getPostsWithUserData>>[number]
type GetPostsWithUserDataParams = {
   pageSize: number
   cursor: string | null
}
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

export const createNewPost = async (data: CreateNewPostParams) => {
   return await prisma.post.create({
      data,
      include: postDataInclude,
   })
}
