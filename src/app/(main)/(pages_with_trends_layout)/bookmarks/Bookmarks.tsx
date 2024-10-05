'use client'

import { InfiniteScrollContainer } from '@/components/InfiniteScrollContainer'
import { Post } from '@/components/posts/Post'
import { PostsLoadingSkeleton } from '@/components/posts/components/PostsLoadingSkeleton'
import { BookmarksData } from '@/controllers/bookmarks'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

export const Bookmarks = () => {
   const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
      queryKey: ['post-feed', 'bookmarks'],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get('/api/posts/bookmarked', pageParam ? { searchParams: { cursor: pageParam } } : {})
            .json<BookmarksData[]>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.id ?? null,
   })
   const bookmarks = data?.pages.flat(1) || []
   if (status === 'pending') {
      return <PostsLoadingSkeleton />
   }
   if (status === 'success' && !bookmarks.length && !hasNextPage) {
      return <p className='text-center text-muted-foreground'>You don&apos;t have any bookmarks yet</p>
   }
   if (status === 'error') {
      return <p className='text-center text-destructive'>An error occurred while loading bookmarks</p>
   }

   return (
      <InfiniteScrollContainer
         className='space-y-5'
         onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
         {bookmarks.map((bookmark) => (
            <Post key={bookmark.postId} post={bookmark.post} />
         ))}
         {isFetchingNextPage && <Loader2 className='mx-auto my-3 animate-spin' />}
      </InfiniteScrollContainer>
   )
}
