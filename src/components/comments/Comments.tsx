import { PostType } from '@/controllers/posts'
import { CommentInput } from './CommentInput'
import { useInfiniteQuery } from '@tanstack/react-query'
import { kyInstance } from '@/lib/ky'
import { CommentData } from '@/controllers/comments'
import { Comment } from './Comment'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export type CommentsProps = { post: PostType }

export const Comments = ({ post }: CommentsProps) => {
   const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
      queryKey: ['comments', { postId:post.id }],
      queryFn: ({ pageParam }) =>
         kyInstance
            .get(`/api/posts/${post.id}/comments`, pageParam ? { searchParams: { cursor: pageParam } } : {})
            .json<CommentData[]>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage, allPages) =>
         (post._count.comments > allPages.flat(1).length && lastPage.at(0)?.id) || null,
      select: (data) => ({ pages: [...data.pages].reverse(), pageParams: [...data.pageParams].reverse() }),
   })
   const comments = data?.pages.flat(1) || []
   return (
      <div className='space-y-3'>
         <CommentInput post={post} />
         {hasNextPage && (
            <Button variant='link' className='mx-auto block' disabled={isFetching} onClick={() => fetchNextPage()}>
               Load previous comments
            </Button>
         )}
         {status === 'pending' && <Loader2 className='mx-auto animate-spin' />}
         {status === 'success' && !comments.length && (
            <p className='text-center text-muted-foreground'>No comments yet</p>
         )}
         {status === 'error' && (
            <p className='text-center text-destructive'>An error occurred while loading comments</p>
         )}
         <div className='divide-y'>
            {comments.map((comment) => (
               <Comment key={comment.id} comment={comment} />
            ))}
         </div>
      </div>
   )
}
