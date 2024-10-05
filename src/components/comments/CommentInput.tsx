import { PostType } from '@/controllers/posts'
import { useState } from 'react'
import { useSubmitCommentMutation } from './mutations'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, SendHorizonal } from 'lucide-react'

export type CommentInputProps = {
   post: PostType
}

export const CommentInput = ({ post }: CommentInputProps) => {
   const [input, setInput] = useState('')
   const mutation = useSubmitCommentMutation(post.id)
   const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input) return
      mutation.mutate({ post, content: input }, { onSuccess: () => setInput('') })
   }
   return (
      <form onSubmit={onSubmit} className='flex w-full items-center gap-2'>
         <Input placeholder='Write a comment...' value={input} onChange={(e) => setInput(e.target.value)} autoFocus />
         <Button type='submit' variant='ghost' size='icon' disabled={!input.trim() || mutation.isPending}>
            {!mutation.isPending ? <SendHorizonal /> : <Loader2 className='animate-spin' />}
         </Button>
      </form>
   )
}
