import prisma from '@/lib/prisma'
import { getNotificationsInclude } from './queries'
import { PaginationParams } from './types'

type RecipientId = { recipientId: string }
type FindNotificationsParams = RecipientId & PaginationParams

export type NotificationData = Awaited<ReturnType<typeof getNotifications>>[number]
export const getNotifications = async ({ recipientId, cursor, pageSize }: FindNotificationsParams) => {
   return await prisma.notification.findMany({
      where: {
         recipientId,
      },
      include: getNotificationsInclude,
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
   })
}

export const getUnreadNotificationsCount = async ({ recipientId }: RecipientId) => {
   return await prisma.notification.count({
      where: {
         recipientId,
         read: false,
      },
   })
}
