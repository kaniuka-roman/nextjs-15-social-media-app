'use server'
import { loginSchema, LoginValues } from '@/lib/validation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { verify } from '@node-rs/argon2'
import { lucia } from '@/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getExistingUser } from '@/controllers/users'

export const login = async (credentials: LoginValues): Promise<{ error: string }> => {
   try {
      const { username, password } = loginSchema.parse(credentials)
      const existingUser = await getExistingUser(username)
      if (!existingUser || !existingUser.passwordHash) {
         return {
            error: 'Invalid username or password',
         }
      }
      const validPassword = await verify(existingUser.passwordHash, password, {
         memoryCost: 19456,
         timeCost: 2,
         outputLen: 32,
         parallelism: 1,
      })
      if (!validPassword) {
         return {
            error: 'Invalid username or password',
         }
      }
      const session = await lucia.createSession(existingUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
      return redirect('/')
   } catch (error) {
      if (isRedirectError(error)) throw error
      console.log(error)
      return {
         error: 'Something went wrong. Please try again',
      }
   }
}
