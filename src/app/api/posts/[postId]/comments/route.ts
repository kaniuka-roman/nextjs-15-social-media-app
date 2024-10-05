import { validateRequest } from '@/auth'
import { getComments } from '@/controllers/comments'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest, { params: { postId } }: { params: { postId: string } }) => {
   try {
      const cursor = req.nextUrl.searchParams.get('cursor')
      const pageSize = 5
      const { user } = await validateRequest()
      if (!user) {
         return Response.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      const comments = await getComments({ postId, userId: user.id, pageSize, cursor })
      return Response.json(comments)
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
