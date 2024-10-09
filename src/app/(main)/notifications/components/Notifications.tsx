'use client'

import { InfiniteScrollContainer } from '@/components/InfiniteScrollContainer'
import { PostsLoadingSkeleton } from '@/components/posts/components/PostsLoadingSkeleton'
import { NotificationData } from '@/controllers/notifications'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Notification } from './Notification'
import { useEffect } from 'react'

export const Notifications = () => {
   const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
      queryKey: ['notifications'],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get('/api/notifications', pageParam ? { searchParams: { cursor: pageParam } } : {})
            .json<NotificationData[]>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.id ?? null,
   })
   const queryClient = useQueryClient()
   const { mutate } = useMutation({
      mutationFn: () => kyInstance.patch('/api/notifications/mark-as-read'),
      onSuccess: () => {
         queryClient.setQueryData(['unread-notifications-count'], { unreadCount: 0 })
      },
      onError(error) {
         console.error(error)
      },
   })
   useEffect(() => {
      mutate()
   }, [mutate])
   const notifications = data?.pages.flat(1) || []
   if (status === 'pending') {
      return <PostsLoadingSkeleton />
   }
   if (status === 'success' && !notifications.length && !hasNextPage) {
      return <p className='text-center text-muted-foreground'>You don&apos;t have any notifications yet</p>
   }
   if (status === 'error') {
      return <p className='text-center text-destructive'>An error occurred while loading notifications</p>
   }

   return (
      <InfiniteScrollContainer
         className='space-y-5'
         onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
         {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
         ))}
         {isFetchingNextPage && <Loader2 className='mx-auto my-3 animate-spin' />}
      </InfiniteScrollContainer>
   )
}
