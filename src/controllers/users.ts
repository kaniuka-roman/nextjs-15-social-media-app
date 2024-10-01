import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getUserDataInclude } from './queries'

export type UserData = NonNullable<Awaited<ReturnType<typeof getUser>>>
type GetUserFollowersStats = {
   userId: string
   loggedInUser: string
}

export const getExistingUser = async (username: string) => {
   return await prisma.user.findFirst({
      where: {
         username: {
            equals: username,
            mode: 'insensitive',
         },
      },
      select: {
         id: true,
         passwordHash: true,
      },
   })
}

export const getUserFollowersStats = async ({ userId, loggedInUser }: GetUserFollowersStats) => {
   return await prisma.user.findUnique({
      where: { id: userId },
      select: {
         followers: {
            where: {
               followerId: loggedInUser,
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
   })
}
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
