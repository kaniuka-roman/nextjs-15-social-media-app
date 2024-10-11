import { validateRequest } from '@/auth'
import streamServerClient from '@/lib/stream'
import { MessagesCountInfo } from '@/lib/types'

export const GET = async () => {
   try {
      const { user } = await validateRequest()
      if (!user) {
         return Response.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      const { total_unread_count } = await streamServerClient.getUnreadCount(user.id)
      const resData: MessagesCountInfo = {
         unreadCount: total_unread_count,
      }
      return Response.json(resData)
   } catch (error) {
      console.error(error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
