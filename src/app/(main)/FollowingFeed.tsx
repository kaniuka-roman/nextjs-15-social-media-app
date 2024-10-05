'use client'

import { InfiniteScrollContainer } from '@/components/InfiniteScrollContainer'
import { PostsLoadingSkeleton } from '@/components/posts/components/PostsLoadingSkeleton'
import { Post } from '@/components/posts/Post'
import { PostType } from '@/controllers/posts'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

export const FollowingFeed = () => {
   const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
      queryKey: ['post-feed', 'following'],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get('/api/posts/following', pageParam ? { searchParams: { cursor: pageParam } } : {})
            .json<PostType[]>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.id ?? null,
   })
   const posts = data?.pages.flat(1) || []
   if (status === 'pending') {
      return <PostsLoadingSkeleton />
   }
   if (status === 'success' && !posts.length && !hasNextPage) {
      return (
         <p className='text-center text-muted-foreground'>
            No posts found. Start following people to see their posts here
         </p>
      )
   }
   if (status === 'error') {
      return <p className='text-center text-destructive'>An error occurred while loading posts</p>
   }

   return (
      <InfiniteScrollContainer
         className='space-y-5'
         onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
         {posts.map((post) => (
            <Post key={post.id} post={post} />
         ))}
         {isFetchingNextPage && <Loader2 className='mx-auto my-3 animate-spin' />}
      </InfiniteScrollContainer>
   )
}
