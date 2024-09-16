import prisma from '@/lib/prisma'

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
