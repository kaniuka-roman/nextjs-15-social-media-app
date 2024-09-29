'use client'

import { Button } from '@/components/ui/button'
import { UserData } from '@/controllers/users'
import { useState } from 'react'
import { EditProfileDialog } from './EditProfileDialog'

export type EditProfileButtonProps = {
   user: UserData
}

export const EditProfileButton = ({ user }: EditProfileButtonProps) => {
   const [showDialog, setShowDialog] = useState(false)
   return (
      <>
         <Button variant={'outline'} onClick={() => setShowDialog(true)}>
            Edit profile
         </Button>
         <EditProfileDialog user={user} open={showDialog} onOpenChange={setShowDialog} />
      </>
   )
}
