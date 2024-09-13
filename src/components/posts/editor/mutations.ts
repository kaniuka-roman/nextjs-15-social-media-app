import { useToast } from '@/components/ui/use-toast'
import { InfiniteData, QueryFilters, useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { submitPost } from './actions'
import { PostType } from '@/controllers/posts'

export const useSubmitPostMutation = () => {
   const { toast } = useToast()
   const queryClient = useQueryClient()
   const mutation = useMutation({
      mutationFn: submitPost,
      onSuccess: async (newPost) => {
         const queryFilter: QueryFilters = { queryKey: ['post-feed', 'for-you'] }
         await queryClient.cancelQueries(queryFilter)
         queryClient.setQueriesData<InfiniteData<PostType[], string | null>>(queryFilter, (oldData) => {
            if (oldData?.pages.length) {
               return {
                  pageParams: oldData.pageParams,
                  pages: oldData.pages.map((page, i) => (i === 0 ? [newPost, ...page] : page)),
               }
            }
         })
         queryClient.invalidateQueries({
            queryKey: queryFilter.queryKey,
            predicate: (query) => {
               return !query.state.data
            },
         })
         toast({
            description: 'Post created',
         })
      },
      onError: (error) => {
         console.log(error)
         toast({
            variant: 'destructive',
            description: 'Failed to post. Please try again',
         })
      },
   })
   return mutation
}
