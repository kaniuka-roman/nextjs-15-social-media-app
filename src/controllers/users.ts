import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getUserDataInclude } from './queries'

export type UserData = NonNullable<Awaited<ReturnType<typeof getUser>>>

export const getUserFollowers = async (userId: string) => {
   return await prisma.user.findMany({
      where: {
         NOT: {
            id: userId,
         },
         followers: {
            none: {
               followerId: userId,
            },
         },
      },
      include: getUserDataInclude(userId),
      take: 5,
   })
}
export const getUser = async (username: string, userId: string) => {
   return await prisma.user.findFirst({
      where: {
         username: {
            equals: username,
            mode: 'insensitive',
         },
      },
      include: getUserDataInclude(userId),
   })
}
export const updateUserProfileData = async ({ userId, data }: { userId: string; data: Prisma.UserUpdateInput }) => {
   return await prisma.user.update({
      where: {
         id: userId,
      },
      data,
      include: getUserDataInclude(userId),
   })
}
