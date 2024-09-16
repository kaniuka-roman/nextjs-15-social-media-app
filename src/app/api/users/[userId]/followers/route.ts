import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { FollowerInfo } from '@/lib/types'

export const GET = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
   try {
      const { user: loggedUser } = await validateRequest()

      if (!loggedUser) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: {
            followers: {
               where: {
                  followerId: loggedUser.id,
               },
               select: {
                  followerId: true,
               },
            },
            _count: {
               select: {
                  followers: true,
               },
            },
         },
      })
      if (!user) {
         return Response.json({ error: 'User not found' }, { status: 404 })
      }

      const data: FollowerInfo = {
         followers: user._count.followers,
         isFollowedByUser: !!user.followers.length,
      }

      return Response.json(data)
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export const POST = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
   try {
      const { user: loggedUser } = await validateRequest()

      if (!loggedUser) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      await prisma.follow.upsert({
         where: {
            followerId_followingId: {
               followerId: loggedUser.id,
               followingId: userId,
            },
         },
         create: {
            followerId: loggedUser.id,
            followingId: userId,
         },
         update: {},
      })
      return new Response()
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export const DELETE = async (req: Request, { params: { userId } }: { params: { userId: string } }) => {
   try {
      const { user: loggedUser } = await validateRequest()

      if (!loggedUser) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      await prisma.follow.deleteMany({
         where: {
            followerId: loggedUser.id,
            followingId: userId,
         },
      })
      return new Response()
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
