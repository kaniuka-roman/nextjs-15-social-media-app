import prisma from '@/lib/prisma'

export const getUnusedMedia = async () =>
   await prisma.media.findMany({
      where: {
         postId: null,
         ...(process.env.NODE_ENV === 'production'
            ? {
                 createdAt: {
                    lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
                 },
              }
            : {}),
      },
      select: {
         id: true,
         url: true,
      },
   })

export const deleteUnusedMedia = async (unusedMedia: Awaited<ReturnType<typeof getUnusedMedia>>) =>
   await prisma.media.deleteMany({
      where: {
         id: {
            in: unusedMedia.map((m) => m.id),
         },
      },
   })
