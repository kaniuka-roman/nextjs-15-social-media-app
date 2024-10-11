'use server'

import { validateRequest } from '@/auth'
import { getUserDataInclude } from '@/controllers/queries'
import prisma from '@/lib/prisma'
import streamServerClient from '@/lib/stream'
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
   const validatedValues = updateUserProfileSchema.parse(values)
   const { user } = await validateRequest()
   if (!user) throw new Error('Unauthorized')
   const updatedUser = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
         where: {
            id: user.id,
         },
         data: validatedValues,
         include: getUserDataInclude(user.id),
      })
      await streamServerClient.partialUpdateUser({
         id: user.id,
         set: {
            name: validatedValues.displayName,
         },
      })
      return updatedUser
   })
   return updatedUser
}
