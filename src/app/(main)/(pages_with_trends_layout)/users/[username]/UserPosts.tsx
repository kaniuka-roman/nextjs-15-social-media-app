'use client'

import { InfiniteScrollContainer } from '@/components/InfiniteScrollContainer'
import { PostsLoadingSkeleton } from '@/components/posts/components/PostsLoadingSkeleton'
import { Post } from '@/components/posts/Post'
import { PostType } from '@/controllers/posts'
import { kyInstance } from '@/lib/ky'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

type UserPostsProps = {
   userId: string
}

export const UserPosts = ({ userId }: UserPostsProps) => {
   const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery({
      queryKey: ['post-feed', 'user-posts', userId],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(`/api/users/${userId}/posts`, pageParam ? { searchParams: { cursor: pageParam } } : {})
            .json<PostType[]>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.id ?? null,
   })
   const posts = data?.pages.flat(1) || []
   if (status === 'pending') {
      return <PostsLoadingSkeleton />
   }
   if (status === 'success' && !posts.length && !hasNextPage) {
      return <p className="text-center text-muted-foreground">{"This user hasn't posted anything yet"}</p>
   }
   if (status === 'error') {
      return <p className="text-center text-destructive">An error occured while loading posts</p>
   }

   return (
      <InfiniteScrollContainer
         className="space-y-5"
         onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      >
         {posts.map((post) => (
            <Post key={post.id} post={post} />
         ))}
         {isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />}
      </InfiniteScrollContainer>
   )
}
