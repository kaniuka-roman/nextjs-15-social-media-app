import { CommentData } from '@/controllers/comments'
import { PostType } from '@/controllers/posts'
import { useDeleteCommentMutation } from './mutations'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { LoadingButton } from '../LoadingButton'
import { Button } from '../ui/button'

export type DeleteCommentDialogProps = {
   comment: CommentData
   open: boolean
   onClose: () => void
}

export const DeleteCommentDialog = ({ onClose, open, comment }: DeleteCommentDialogProps) => {
   const mutation = useDeleteCommentMutation()
   const handleOpenChange = (open: boolean) => {
      if (!open || !mutation.isPending) onClose()
   }
   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Delete comment?</DialogTitle>
               <DialogDescription>
                  Are you sure you want delete this comment? This action cannot been undone.
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <LoadingButton
                  loading={mutation.isPending}
                  variant='destructive'
                  onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
               >
                  Delete
               </LoadingButton>
               <Button variant='outline' onClick={onClose} disabled={mutation.isPending}>
                  Cancel
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
