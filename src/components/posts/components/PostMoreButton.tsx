import { PostType } from '@/controllers/posts'
import { useState } from 'react'
import { DeletePostDialog } from './DeletePostDialog'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { Button } from '../../ui/button'
import { MoreHorizontal, Trash2 } from 'lucide-react'

export type PostMoreButtonProps = {
   post: PostType
   className?: string
}

export const PostMoreButton = ({ post, className }: PostMoreButtonProps) => {
   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button size={'icon'} variant={'ghost'} className={className}>
                  <MoreHorizontal className="size-5 text-muted-foreground" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                  <span className="flex items-center gap-3 text-destructive">
                     <Trash2 className="size-4" />
                     Delete
                  </span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
         <DeletePostDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
      </>
   )
}
