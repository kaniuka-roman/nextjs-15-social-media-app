'use client'

import { InfiniteScrollContainer } from '@/components/InfiniteScrollConainer'
import { Post } from '@/components/posts/Post'
import { PostsLoadingSkeleton } from '@/components/posts/PostsLoadingSkeleton'
import { PostType } from '@/controllers/posts'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

export const ForYouFeed = () => {
   const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
      queryKey: ['post-feed', 'for-you'],
      queryFn: ({ pageParam }) => kyInstance.get('/api/posts/for-you', pageParam ? { searchParams: { cursor: pageParam } } : {}).json<PostType[]>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.id ?? null,
   })
   const posts = data?.pages.flat(1) || []
   if (status === 'pending') {
      return <PostsLoadingSkeleton />
   }
   if (status === 'success' && !posts.length && !hasNextPage) {
      return <p className="text-center text-muted-foreground">No one has posted anurhink yet</p>
   }
   if (status === 'error') {
      return <p className="text-center text-destructive">An error occured while loading posts</p>
   }

   return (
      <InfiniteScrollContainer className="space-y-5" onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
         {posts.map((post) => (
            <Post key={post.id} post={post} />
         ))}
         {isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />}
      </InfiniteScrollContainer>
   )
}
