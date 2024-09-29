'use server'

import { validateRequest } from '@/auth'
import { createNewPost } from '@/controllers/posts'
import { createPostSchema } from '@/lib/validation'

export const submitPost = async (input: { content: string; mediaIds: string[] }) => {
   const { user } = await validateRequest()
   if (!user) throw new Error('Unauthorized')
   const { content, mediaIds } = createPostSchema.parse(input)
   const newPost = await createNewPost({ content, userId: user.id, mediaIds })
   return newPost
}
