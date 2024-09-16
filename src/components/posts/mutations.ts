import { PostType } from '@/controllers/posts'
import { useToast } from '../ui/use-toast'
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { deletePostAction } from './actions'

export const useDeletePostMutation = () => {
   const { toast } = useToast()
   const queryClient = useQueryClient()
   const router = useRouter()
   const pathname = usePathname()
   const mutation = useMutation({
      mutationFn: deletePostAction,
      onSuccess: async (deletedPost) => {
         const queryFilter: QueryFilters = { queryKey: ['post-feed'] }
         await queryClient.cancelQueries(queryFilter)
         queryClient.setQueriesData<InfiniteData<PostType[], string | null>>(queryFilter, (oldData) => {
            if (!oldData?.pageParams) return
            const isDeletedPostIsCursor = oldData.pageParams.findIndex((pageParam) => pageParam === deletedPost.id)
            const updatePageParams = oldData.pageParams.map((pageParam) =>
               pageParam === deletedPost.id ? (oldData.pages[isDeletedPostIsCursor]?.at(-2)?.id ?? null) : pageParam
            )
            return {
               pageParams: isDeletedPostIsCursor > -1 ? updatePageParams : oldData.pageParams,
               pages: oldData.pages.map((page) => page.filter((post) => post.id !== deletedPost.id)),
            }
         })
         toast({
            description: 'Post deleted',
         })
         if (pathname === `/posts/${deletedPost.id}`) {
            router.replace(`/`)
         }
      },
      onError: (error) => {
         console.log('useDeletePostMutation ~ error:', error)
         toast({
            variant: 'destructive',
            description: 'Failed to elete post. Please try again',
         })
      },
   })

   return mutation
}
