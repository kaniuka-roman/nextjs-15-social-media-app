import { validateRequest } from '@/auth'
import { getPostLikes, likePost, unlikePost } from '@/controllers/posts'
import prisma from '@/lib/prisma'
import { LikeInfo } from '@/lib/types'

export const GET = async (req: Request, { params: { postId } }: { params: { postId: string } }) => {
   try {
      const { user: loggedInUser } = await validateRequest()

      if (!loggedInUser) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const post = await getPostLikes({ postId, userId: loggedInUser.id })
      if (!post) {
         return Response.json({ error: 'Post not found' }, { status: 404 })
      }
      const data: LikeInfo = {
         likes: post._count.likes,
         isLikedByUser: !!post.likes.length,
      }

      return Response.json(data)
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
export const POST = async (req: Request, { params: { postId } }: { params: { postId: string } }) => {
   try {
      const { user: loggedInUser } = await validateRequest()

      if (!loggedInUser) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const post = await prisma.post.findUnique({
         where: { id: postId },
         select: {
            userId: true,
         },
      })
      if (!post) return Response.json({ error: 'Post not found' }, { status: 404 })
      await likePost({ userId: loggedInUser.id, postId, postAuthorId: post.userId })

      return new Response()
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
export const DELETE = async (req: Request, { params: { postId } }: { params: { postId: string } }) => {
   try {
      const { user: loggedInUser } = await validateRequest()

      if (!loggedInUser) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const post = await prisma.post.findUnique({
         where: { id: postId },
         select: {
            userId: true,
         },
      })
      if (!post) return Response.json({ error: 'Post not found' }, { status: 404 })
      await unlikePost({ userId: loggedInUser.id, postId, postAuthorId: post.userId })

      return new Response()
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
