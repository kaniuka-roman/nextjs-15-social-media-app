'use server'

import { validateRequest } from '@/auth'
import { createNewPost } from '@/controllers/posts'
import { createPostSchema } from '@/lib/validation'

export const submitPost = async (input: string) => {
   const { user } = await validateRequest()
   if (!user) throw new Error('Unauthorized')
   const { content } = createPostSchema.parse({ content: input })
   const newPost = await createNewPost({ content, userId: user.id })
   return newPost
}
