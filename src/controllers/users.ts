import prisma from '@/lib/prisma'

export type UserData = Awaited<ReturnType<typeof getUser>>

export const getUserFollowers = async (id: string) => {
   return await prisma.user.findMany({
      where: {
         NOT: {
            id,
         },
         followers: {
            none: {
               followerId: id,
            },
         },
      },
      select: {
         id: true,
         avatarUrl: true,
         displayName: true,
         username: true,
         followers: {
            where: {
               followerId: id,
            },
            select: {
               followerId: true,
            },
         },
         _count: {
            select: {
               followers: true,
            },
         },
      },
      take: 5,
   })
}
export const getUser = async (username: string, userId: string) => {
   console.log('getUser ~ username:', username)
   return await prisma.user.findFirst({
      where: {
         username: {
            equals: username,
            mode: 'insensitive',
         },
      },
      select: {
         id: true,
         avatarUrl: true,
         displayName: true,
         username: true,
         bio: true,
         createdAt: true,
         followers: {
            where: {
               followerId: userId,
            },
            select: {
               followerId: true,
            },
         },
         _count: {
            select: {
               posts: true,
               followers: true,
            },
         },
      },
   })
}
