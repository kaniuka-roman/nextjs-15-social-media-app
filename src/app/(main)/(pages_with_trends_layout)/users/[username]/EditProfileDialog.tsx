import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserData } from '@/controllers/users'
import { updateUserProfileSchema, UpdateUserProfileValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUpdateProfileMutaion } from './mutaions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingButton } from '@/components/LoadingButton'
import Image, { StaticImageData } from 'next/image'
import { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Camera, User } from 'lucide-react'
import { CropImageDialog } from '@/components/CropImageDialog'
import Resizer from 'react-image-file-resizer'

export type EditProfileDialogProps = {
   user: UserData
   open: boolean
   onOpenChange: (open: boolean) => void
}

export const EditProfileDialog = ({ user, open, onOpenChange }: EditProfileDialogProps) => {
   const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)
   const form = useForm<UpdateUserProfileValues>({
      resolver: zodResolver(updateUserProfileSchema),
      defaultValues: {
         displayName: user.displayName,
         bio: user.bio || '',
      },
   })

   const mutation = useUpdateProfileMutaion()
   const onSubmit = async (values: UpdateUserProfileValues) => {
      const newAvatarFile = croppedAvatar ? new File([croppedAvatar], `avatar_${user.id}.webp`) : undefined
      mutation.mutate(
         { values, avatar: newAvatarFile },
         {
            onSuccess: () => {
               setCroppedAvatar(null)
               onOpenChange(false)
            },
         }
      )
   }
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Edit profile</DialogTitle>
            </DialogHeader>
            <div className='space-y-1.5'>
               <Label>Avatar</Label>
               <AvatarInput
                  src={croppedAvatar ? URL.createObjectURL(croppedAvatar) : user.avatarUrl}
                  onImageCropped={setCroppedAvatar}
               />
            </div>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
                  <FormField
                     control={form.control}
                     name='displayName'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Display name</FormLabel>
                           <FormControl>
                              <Input placeholder='Your display name' {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name='bio'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Bio</FormLabel>
                           <FormControl>
                              <Textarea
                                 className='resize-none'
                                 placeholder='Tell us a little bit about yourself'
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <DialogFooter>
                     <LoadingButton
                        type='submit'
                        // disabled={!form.formState.isDirty || !croppedAvatar}
                        loading={mutation.isPending}
                     >
                        Save
                     </LoadingButton>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export type AvatarInputProps = {
   src: string | StaticImageData | undefined | null
   onImageCropped: (blob: Blob | null) => void
}

export const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
   const [imageToCrop, setImageToCrop] = useState<File>()
   const fileInputRef = useRef<HTMLInputElement>(null)
   const onImageSelected = (image: File | undefined) => {
      if (!image) return
      Resizer.imageFileResizer(image, 1024, 1024, 'WEBP', 100, 0, (uri) => setImageToCrop(uri as File), 'file')
   }
   return (
      <>
         <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={(e) => onImageSelected(e.target.files?.[0])}
            className='sr-only hidden'
         />
         <button type='button' onClick={() => fileInputRef.current?.click()} className='group relative block'>
            {src ? (
               <Image
                  src={src}
                  alt='avatar preview'
                  width={150}
                  height={150}
                  className='size-32 flex-none rounded-full object-cover'
               />
            ) : (
               <User
                  className='aspect-square h-fit flex-none rounded-full bg-secondary object-cover'
                  strokeWidth={1}
                  width={150}
                  height={150}
               />
            )}
            <span className='trnsition-colors absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white duration-200 group-hover:bg-opacity-25'>
               <Camera size={24} />
            </span>
         </button>
         {imageToCrop && (
            <CropImageDialog
               src={URL.createObjectURL(imageToCrop)}
               cropAspectRatio={1}
               onCropped={onImageCropped}
               onClose={() => {
                  setImageToCrop(undefined)
                  if (fileInputRef.current) {
                     fileInputRef.current.value = ''
                  }
               }}
            />
         )}
      </>
   )
}
