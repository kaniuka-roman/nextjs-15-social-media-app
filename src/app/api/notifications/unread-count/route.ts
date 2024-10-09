import { validateRequest } from '@/auth'
import { getUnreadNotificationsCount } from '@/controllers/notifications'
import { NotificationCountInfo } from '@/lib/types'

export const GET = async () => {
   try {
      const { user } = await validateRequest()
      if (!user) {
         return Response.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      const count = await getUnreadNotificationsCount({ recipientId: user.id })
      const resData: NotificationCountInfo = {
         unreadCount: count,
      }
      return Response.json(resData)
   } catch (error) {
      console.error(error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
