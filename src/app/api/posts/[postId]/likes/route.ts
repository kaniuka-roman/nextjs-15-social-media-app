import { validateRequest } from '@/auth'
import { getPostLikes, likePost, unlikePost } from '@/controllers/posts'
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
      await likePost({ postId, userId: loggedInUser.id })

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
      await unlikePost({ postId, userId: loggedInUser.id })

      return new Response()
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
