import prisma from '@/lib/prisma'
export type PostType = Awaited<ReturnType<typeof getPostsWithUserData>>[number]
type GetPostsWithUserDataParams = {
   pageSize: number
   cursor: string | null
}
export const getPostsWithUserData = async (params?: GetPostsWithUserDataParams) => {
   const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
         user: {
            select: {
               username: true,
               displayName: true,
               avatarUrl: true,
            },
         },
      },
      take: params?.pageSize ?? undefined,
      skip: params?.cursor ? 1 : 0,
      cursor: params?.cursor ? { id: params?.cursor } : undefined,
   })
   return posts
}
