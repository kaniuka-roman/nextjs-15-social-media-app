import { validateRequest } from '@/auth'
import { getPostsFollowedUsers } from '@/controllers/posts'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
   try {
      const cursor = req.nextUrl.searchParams.get('cursor')
      const pageSize = 10
      const { user } = await validateRequest()
      if (!user) {
         return Response.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      const posts = await getPostsFollowedUsers({ pageSize, cursor, id: user.id })
      return Response.json(posts)
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
