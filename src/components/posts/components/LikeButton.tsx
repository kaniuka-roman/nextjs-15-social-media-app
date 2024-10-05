import { useToast } from '@/components/ui/use-toast'
import { kyInstance } from '@/lib/ky'
import { LikeInfo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Heart } from 'lucide-react'

export type LikeButtonProps = {
   postId: string
   initialState: LikeInfo
}

export const LikeButton = ({ postId, initialState }: LikeButtonProps) => {
   const { toast } = useToast()
   const queryClient = useQueryClient()
   const queryKey: QueryKey = ['like-info', postId]
   const { data } = useQuery({
      queryKey,
      queryFn: () => kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
      initialData: initialState,
      staleTime: Infinity,
   })
   const { mutate } = useMutation({
      mutationFn: () =>
         data.isLikedByUser
            ? kyInstance.delete(`/api/posts/${postId}/likes`)
            : kyInstance.post(`/api/posts/${postId}/likes`),
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey })
         const previousState = queryClient.getQueryData<LikeInfo>(queryKey)
         queryClient.setQueryData<LikeInfo>(queryKey, () => ({
            likes: (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
            isLikedByUser: !previousState?.isLikedByUser,
         }))
         return { previousState }
      },
      onError(error, variables, context) {
         queryClient.setQueryData(queryKey, context?.previousState)
         console.error(error)
         toast({
            variant: 'destructive',
            description: 'Something went wrong/ Please try again',
         })
      },
   })
   return (
      <button onClick={() => mutate()} className='flex items-center gap-2'>
         <Heart className={cn('size-5', { 'fill-red-500 text-red-500': data.isLikedByUser })} />
         <span className='text-sm font-medium tabular-nums'>
            {data.likes} <span className='hidden sm:inline'>{data.likes !== 1 ? 'likes' : 'like'}</span>
         </span>
      </button>
   )
}
