'use client'

import { Button } from '@/components/ui/button'
import { NOTIFICATIONS_REVALIDATE_TIME } from '@/lib/constants'
import { kyInstance } from '@/lib/ky'
import { NotificationCountInfo } from '@/lib/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export type NotificationsButtonProps = {
   initialState: NotificationCountInfo
}

export const NotificationsButton = ({ initialState }: NotificationsButtonProps) => {
   const { data } = useQuery({
      queryKey: ['unread-notifications-count'],
      queryFn: () => kyInstance.get('/api/notifications/unread-count').json<NotificationCountInfo>(),
      initialData: initialState,
      refetchInterval: NOTIFICATIONS_REVALIDATE_TIME,
   })
   const queryClient = useQueryClient()
   useEffect(() => {
      if (data.unreadCount) queryClient.invalidateQueries({ queryKey: ['notifications'] })
   }, [data.unreadCount, queryClient])
   return (
      <Button variant={'ghost'} className='flex items-center justify-start gap-3' title={'Notifications'} asChild>
         <Link href='/notifications'>
            <div className='relative'>
               <Bell />
               {!!data.unreadCount && (
                  <span className='absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground'>
                     {data.unreadCount}
                  </span>
               )}
            </div>
            <span className='hidden lg:inline'>Notifications</span>
         </Link>
      </Button>
   )
}
