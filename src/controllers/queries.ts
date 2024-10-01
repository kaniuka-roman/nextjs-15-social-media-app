import { Prisma } from '@prisma/client'

export const getUserDataInclude = (id: string) => ({
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
         posts: true,
         followers: true,
      },
   },
})
export const getPostDataInclude = (userId: string) =>
   ({
      user: {
         include: {
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
      },
      attachments: true,
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
   }) satisfies Prisma.PostInclude
