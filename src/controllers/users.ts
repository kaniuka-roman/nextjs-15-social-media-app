import prisma from '@/lib/prisma'

export const getUserFollowers = async (id: string) => {
   return await prisma.user.findMany({
      where: {
         NOT: {
            id: id,
         },
      },
      select: {
         id: true,
         avatarUrl: true,
         displayName: true,
         username: true,
      },
      take: 5,
   })
}
