import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'

export const PATCH = async () => {
   try {
      const { user } = await validateRequest()
      if (!user) {
         return Response.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      await prisma.notification.updateMany({
         where: {
            recipientId: user.id,
            read: false,
         },
         data: {
            read: true,
         },
      })
      return new Response()
   } catch (error) {
      console.error(error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
