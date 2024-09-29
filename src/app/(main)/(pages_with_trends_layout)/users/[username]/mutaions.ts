import { useToast } from '@/components/ui/use-toast'
import { useUploadThing } from '@/lib/upladthing'
import { UpdateUserProfileValues } from '@/lib/validation'
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { updateUserProfile } from './actions'
import { PostType } from '@/controllers/posts'

export const useUpdateProfileMutaion = () => {
   const { toast } = useToast()
   const router = useRouter()
   const queryClient = useQueryClient()
   const { startUpload: startAvatarUpload } = useUploadThing('avatar')
   const mutation = useMutation({
      mutationFn: async ({ values, avatar }: { values: UpdateUserProfileValues; avatar?: File }) => {
         return Promise.all([updateUserProfile(values), avatar && startAvatarUpload([avatar])])
      },
      onSuccess: async ([updatedUser, uploadResult]) => {
         const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl
         const queryFilter: QueryFilters = {
            queryKey: ['post-feed'],
         }

         await queryClient.cancelQueries(queryFilter)
         queryClient.setQueriesData<InfiniteData<PostType[], string | null>>(queryFilter, (oldData) => {
            if (!oldData) return
            const updatedPost = {
               pageParams: oldData.pageParams,
               pages: oldData.pages.map((page) => {
                  return page.map((post) => {
                     return post.userId !== updatedUser.id
                        ? post
                        : {
                             ...post,
                             user: {
                                ...updatedUser,
                                avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                             },
                          }
                  })
               }),
            }
            return updatedPost
         })
         router.refresh()
         toast({
            description: 'Profile updated',
         })
      },
      onError(err) {
         console.error(err)
         toast({
            variant: 'destructive',
            description: 'Failed to updated profile. Please try again',
         })
      },
   })
   return mutation
}
