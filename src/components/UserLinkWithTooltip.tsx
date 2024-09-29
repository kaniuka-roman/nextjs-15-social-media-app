'use client'

import { UserData } from '@/controllers/users'
import { kyInstance } from '@/lib/ky'
import { useQuery } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import Link from 'next/link'
import { ReactNode } from 'react'
import { UserTooltip } from './UserTooltip'

export type UserLinkWithTooltipProps = {
   children: ReactNode
   username: string
}

export const UserLinkWithTooltip = ({ children, username }: UserLinkWithTooltipProps) => {
   const { data } = useQuery({
      queryKey: ['user-data', username],
      queryFn: async () => kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
      staleTime: Infinity,
      retry(failureCount, error) {
         if (error instanceof HTTPError && error.response.status === 404) {
            return false
         }
         return failureCount < 3
      },
   })
   if (!data)
      return (
         <Link href={`/users/${username}`} className="text-primary hover:underline">
            {children}
         </Link>
      )
   return (
      <UserTooltip user={data}>
         <Link href={`/users/${username}`} className="text-primary hover:underline">
            {children}
         </Link>
      </UserTooltip>
   )
}
