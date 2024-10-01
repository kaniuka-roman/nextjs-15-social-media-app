import { validateRequest } from '@/auth'
import { addPostToBookmarks, deletePostFromBookmarks, getBookmark } from '@/controllers/bookmarks'
import { BookmarkInfo } from '@/lib/types'

export const GET = async (req: Request, { params: { postId } }: { params: { postId: string } }) => {
   try {
      const { user: loggedInUser } = await validateRequest()

      if (!loggedInUser) {
         return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const bookmark = await getBookmark({ postId, userId: loggedInUser.id })
      const data: BookmarkInfo = {
         isBookmarkedByUser: !!bookmark,
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
      await addPostToBookmarks({ postId, userId: loggedInUser.id })

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
      await deletePostFromBookmarks({ postId, userId: loggedInUser.id })

      return new Response()
   } catch (error) {
      console.log('GET ~ error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
