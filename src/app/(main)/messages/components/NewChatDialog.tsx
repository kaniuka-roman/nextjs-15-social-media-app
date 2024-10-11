import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react'
import { useSession } from '../../SessionProvider'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { UserResponse } from 'stream-chat'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Check, Loader2, SearchIcon, X } from 'lucide-react'
import { UserAvatar } from '@/components/UserAvatar'
import { LoadingButton } from '@/components/LoadingButton'

export type NewChatDialogProps = {
   onOpenChange: (open: boolean) => void
   onChatCreated: () => void
}

export const NewChatDialog = ({ onOpenChange, onChatCreated }: NewChatDialogProps) => {
   const { client, setActiveChannel } = useChatContext()
   const { toast } = useToast()
   const { user: loggedInUser } = useSession()
   const [searchInput, setSearchInput] = useState('')
   const searchInputDebounce = useDebounce(searchInput)
   const [selectedUsers, setSelectedUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>([])
   const { data, isFetching, isError, isSuccess } = useQuery({
      queryKey: ['stream-users', searchInputDebounce],
      queryFn: async () =>
         client.queryUsers(
            {
               id: { $ne: loggedInUser.id },
               role: { $ne: 'admin' },
               ...(searchInputDebounce
                  ? {
                       $or: [
                          { name: { $autocomplete: searchInputDebounce } },
                          { username: { $autocomplete: searchInputDebounce } },
                       ],
                    }
                  : {}),
            },
            { name: 1, username: 1 },
            { limit: 15 }
         ),
   })

   const mutation = useMutation({
      mutationFn: async () => {
         const channel = client.channel('messaging', {
            members: [loggedInUser.id, ...selectedUsers.map((user) => user.id)],
            name:
               selectedUsers.length > 1
                  ? loggedInUser.displayName + ',  ' + selectedUsers.map((user) => user.name).join(', ')
                  : undefined,
         })
         await channel.create()
         return channel
      },
      onSuccess: (channel) => {
         setActiveChannel(channel)
         onChatCreated()
      },
      onError: (error) => {
         console.error('Error starting chat', error)
         toast({
            variant: 'destructive',
            description: 'Error starting chat. Please try again',
         })
      },
   })
   const checkIfUserSelected = (user: UserResponse<DefaultStreamChatGenerics>) =>
      selectedUsers.some((u) => u.id === user.id)
   return (
      <Dialog open onOpenChange={onOpenChange}>
         <DialogContent className='bg-card p-0'>
            <DialogHeader className='px-6 pt-6'>
               <DialogTitle>New chat</DialogTitle>
            </DialogHeader>
            <div>
               <div className='group relative'>
                  <SearchIcon className='absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary' />
                  <input
                     type='text'
                     placeholder='Search users...'
                     className='h-12 w-full ps-14 focus:outline-none'
                     value={searchInput}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
               </div>
               <div className='flex flex-wrap items-center gap-2 px-4 py-2.5'>
                  {selectedUsers.map((user) => (
                     <SelectedUserTag
                        key={user.id}
                        user={user}
                        onRemove={() => setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))}
                     />
                  ))}
               </div>
               <hr />
               <div className='h-96 overflow-y-auto'>
                  {isSuccess &&
                     data.users.map((user) => (
                        <UserResult
                           key={user.id}
                           user={user}
                           selected={checkIfUserSelected(user)}
                           onClick={() =>
                              setSelectedUsers((prev) =>
                                 checkIfUserSelected(user) ? prev.filter((u) => u.id !== user.id) : [...prev, user]
                              )
                           }
                        />
                     ))}
                  {isSuccess && !data.users.length && (
                     <p className='my-3 text-center text-muted-foreground'>No users found.Try a different name</p>
                  )}
                  {isFetching && <Loader2 className='mx-auto my-3 animate-spin' />}
                  {isError && (
                     <p className='my-3 text-center text-destructive'>An error occurred while loading users</p>
                  )}
               </div>
            </div>
            <DialogFooter className='px-6 pb-6'>
               <LoadingButton
                  onClick={() => mutation.mutate()}
                  loading={mutation.isPending}
                  disabled={!selectedUsers.length}
               >
                  Start chat
               </LoadingButton>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}

export type UserResultProps = {
   user: UserResponse<DefaultStreamChatGenerics>
   selected: boolean
   onClick: () => void
}

export const UserResult = ({ user, selected, onClick }: UserResultProps) => {
   return (
      <button
         className='flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50'
         onClick={onClick}
      >
         <div className='flex items-center gap-2'>
            <UserAvatar avatarUrl={user.image} />
            <div className='flex flex-col text-start'>
               <p className='font-bold'>{user.name}</p>
               <p className='text-muted-foreground'>@{user.username}</p>
            </div>
         </div>
         {selected && <Check className='size-5 text-violet-600' />}
      </button>
   )
}

export type SelectedUserTagProps = {
   user: UserResponse<DefaultStreamChatGenerics>
   onRemove: () => void
}

export const SelectedUserTag = ({ user, onRemove }: SelectedUserTagProps) => {
   return (
      <button className='flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50' onClick={onRemove}>
         <UserAvatar avatarUrl={user.image} size={24} />
         <p className='font-bold'>{user.name}</p>
         <X className='size-5' />
      </button>
   )
}
