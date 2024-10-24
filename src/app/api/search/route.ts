import { validateRequest } from '@/auth'
import { getPostDataInclude } from '@/controllers/queries'
import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
   try {
      const q = req.nextUrl.searchParams.get('q') || ''
      const cursor = req.nextUrl.searchParams.get('cursor')

      const searchQuery = q.split(' ').join(' & ')

      const pageSize = 10
      const { user } = await validateRequest()
      if (!user) {
         return Response.json({ error: 'Unauthenticated' }, { status: 401 })
      }
      const posts = await prisma.post.findMany({
         where: {
            OR: [
               {
                  content: {
                     search: searchQuery,
                  },
               },
               {
                  user: {
                     displayName: {
                        search: searchQuery,
                     },
                  },
               },
               {
                  user: {
                     username: {
                        search: searchQuery,
                     },
                  },
               },
            ],
         },
         include: getPostDataInclude(user.id),
         orderBy: { createdAt: 'desc' },
         take: pageSize ?? undefined,
         skip: cursor ? 1 : 0,
         cursor: cursor ? { id: cursor } : undefined,
      })
      return Response.json(posts)
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
