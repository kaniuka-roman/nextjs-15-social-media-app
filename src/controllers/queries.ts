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
export const getPostUserDataInclude = (id: string) => ({
   user: {
      include: {
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
      },
   },
   attachments: true,
})
