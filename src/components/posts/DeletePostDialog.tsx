import { PostType } from '@/controllers/posts'
import { useDeletePostMutation } from './mutations'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { LoadingButton } from '../LoadingButton'
import { Button } from '../ui/button'

export type DeletePostDialogProps = {
   post: PostType
   open: boolean
   onClose: () => void
}

export const DeletePostDialog = ({ onClose, open, post }: DeletePostDialogProps) => {
   const mutation = useDeletePostMutation()
   const handleOpenChange = (open: boolean) => {
      if (!open || !mutation.isPending) onClose()
   }
   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Delete post?</DialogTitle>
               <DialogDescription>Are u sure you want delete this post? This action cannot been undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <LoadingButton loading={mutation.isPending} variant="destructive" onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}>
                  Delete
               </LoadingButton>
               <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
                  Cancel
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
