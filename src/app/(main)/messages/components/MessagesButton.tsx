'use client'

import { Button } from '@/components/ui/button'
import { MESSAGES_REVALIDATE_TIME } from '@/lib/constants'
import { kyInstance } from '@/lib/ky'
import { MessagesCountInfo } from '@/lib/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export type MessagesButtonProps = {
   initialState: MessagesCountInfo
}

export const MessagesButton = ({ initialState }: MessagesButtonProps) => {
   const { data } = useQuery({
      queryKey: ['unread-messages-count'],
      queryFn: () => kyInstance.get('/api/messages/unread-count').json<MessagesCountInfo>(),
      initialData: initialState,
      refetchInterval: MESSAGES_REVALIDATE_TIME,
   })
   const queryClient = useQueryClient()
   useEffect(() => {
      if (data.unreadCount) queryClient.invalidateQueries({ queryKey: ['notifications'] })
   }, [data.unreadCount, queryClient])
   return (
      <Button variant={'ghost'} className='flex items-center justify-start gap-3' title={'Messages'} asChild>
         <Link href='/messages'>
            <div className='relative'>
               <Mail />
               {!!data.unreadCount && (
                  <span className='absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground'>
                     {data.unreadCount}
                  </span>
               )}
            </div>
            <span className='hidden lg:inline'>Messages</span>
         </Link>
      </Button>
   )
}
