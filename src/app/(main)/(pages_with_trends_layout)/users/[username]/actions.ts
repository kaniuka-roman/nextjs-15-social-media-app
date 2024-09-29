'use server'

import { validateRequest } from '@/auth'
import { updateUserProfileData } from '@/controllers/users'
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
   const validatedValues = updateUserProfileSchema.parse(values)
   const { user } = await validateRequest()
   if (!user) throw new Error('Unauthorized')

   const updatedUser = await updateUserProfileData({ userId: user.id, data: validatedValues })
   return updatedUser
}
