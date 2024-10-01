import { validateRequest } from '@/auth'
import { getUser } from '@/controllers/users'

export const GET = async (req: Request, { params: { username } }: { params: { username: string } }) => {
   try {
      const { user: loggedInUser } = await validateRequest()
      if (!loggedInUser) {
         return Response.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      const user = await getUser(username, loggedInUser.id)
      if (!user) {
         return Response.json({ error: 'User not found' }, { status: 404 })
      }
      return Response.json(user)
   } catch (error) {
      console.log(error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
