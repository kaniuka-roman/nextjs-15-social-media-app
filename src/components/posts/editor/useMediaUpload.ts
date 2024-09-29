import { useToast } from '@/components/ui/use-toast'
import { useUploadThing } from '@/lib/upladthing'
import { useState } from 'react'

export type Attachment = {
   file: File
   mediaId?: string
   isUploading: boolean
}

export const useMediaUpload = () => {
   const { toast } = useToast()
   const [attachments, setAttachments] = useState<Attachment[]>([])
   const [uploadProgress, setUploadProgress] = useState<number>()
   const { startUpload, isUploading } = useUploadThing('attachments', {
      onBeforeUploadBegin(files) {
         const renamedFiles = files.map((file) => {
            const extension = file.name.split('.').at(-1)
            return new File([file], `attachment_${crypto.randomUUID()}.${extension}`, {
               type: file.type,
            })
         })
         setAttachments((prev) => [...prev, ...renamedFiles.map((file) => ({ file, isUploading: true }))])
         return renamedFiles
      },
      onUploadProgress: setUploadProgress,
      onClientUploadComplete(res) {
         setAttachments((prev) =>
            prev.map((attach) => {
               const uploadResult = res.find((res) => res.name === attach.file.name)
               if (!uploadResult) return attach
               return {
                  ...attach,
                  mediaId: uploadResult.serverData.mediaId,
                  isUploading: false,
               }
            })
         )
      },
      onUploadError(e) {
         setAttachments((prev) => prev.filter((attach) => !attach.isUploading))
         toast({
            variant: 'destructive',
            description: e.message,
         })
      },
   })
   const handleStartUpload = (files: File[]) => {
      if (isUploading)
         return toast({ variant: 'destructive', description: 'Please wait for the current upload finish' })
      if (attachments.length + files.length > 5)
         return toast({ variant: 'destructive', description: 'You can only upload up to 5 attachments per post' })
      startUpload(files)
   }
   const removeAttachment = (fileName: string) => {
      setAttachments((prev) => prev.filter((attachment) => attachment.file.name !== fileName))
   }
   const reset = () => {
      setAttachments([])
      setUploadProgress(undefined)
   }
   return {
      startUpload: handleStartUpload,
      attachments,
      isUploading,
      uploadProgress,
      removeAttachment,
      reset,
   }
}
