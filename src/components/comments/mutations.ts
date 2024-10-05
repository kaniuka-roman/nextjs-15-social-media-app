import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import { deleteComment, submitComment } from './actions'
import { CommentData } from '@/controllers/comments'
import { PostType } from '@/controllers/posts'

export const useSubmitCommentMutation = (postId: string) => {
   const { toast } = useToast()
   const queryClient = useQueryClient()
   const mutation = useMutation({
      mutationFn: submitComment,
      onSuccess: async (newComment) => {
         const queryKey: QueryKey = ['comments', { postId }]

         await queryClient.cancelQueries({ queryKey })

         queryClient.setQueriesData<InfiniteData<CommentData[], string | null>>({ queryKey }, (oldData) => {
            if (oldData?.pages.length)
               return {
                  pageParams: oldData.pageParams,
                  pages: oldData.pages.map((page, i) =>
                     i === oldData.pages.length - 1 ? [...page, newComment] : page
                  ),
               }
         })
         queryClient.setQueriesData<InfiniteData<PostType[], string | null>>({ queryKey: ['post-feed'] }, (oldData) => {
            if (oldData?.pages.length)
               return {
                  pageParams: oldData.pageParams,
                  pages: oldData.pages.map((page, i) =>
                     page.map(
                        (post): PostType =>
                           post.id === postId
                              ? { ...post, _count: { ...post._count, comments: post._count.comments + 1 } }
                              : post
                     )
                  ),
               }
         })
         queryClient.invalidateQueries({
            queryKey,
            predicate(query) {
               return !query.state.data
            },
         })
         toast({
            description: 'Comment created',
         })
      },
      onError: (error) => {
         console.log(error)
         toast({
            variant: 'destructive',
            description: 'Failed to submit comment. Please try again',
         })
      },
   })
   return mutation
}

export const useDeleteCommentMutation = () => {
   const { toast } = useToast()
   const queryClient = useQueryClient()
   const mutation = useMutation({
      mutationFn: deleteComment,
      onSuccess: async (deletedComment) => {
         const queryKey: QueryKey = ['comments', { postId: deletedComment.postId }]
         await queryClient.cancelQueries({ queryKey })
         queryClient.setQueryData<InfiniteData<CommentData[], string | null>>(queryKey, (oldData) => {
            if (!oldData) return
            return {
               pageParams: oldData.pageParams,
               pages: oldData.pages.map((page) => page.filter((comm) => comm.id !== deletedComment.id)),
            }
         })
         queryClient.setQueriesData<InfiniteData<PostType[], string | null>>({ queryKey: ['post-feed'] }, (oldData) => {
            if (oldData?.pages.length)
               return {
                  pageParams: oldData.pageParams,
                  pages: oldData.pages.map((page, i) =>
                     page.map(
                        (post): PostType =>
                           post.id === deletedComment.postId
                              ? { ...post, _count: { ...post._count, comments: post._count.comments - 1 } }
                              : post
                     )
                  ),
               }
         })
         toast({
            description: 'Comment deleted',
         })
      },
      onError: (error) => {
         console.log(error)
         toast({
            variant: 'destructive',
            description: 'Failed to delete comment. Please try again',
         })
      },
   })
   return mutation
}
