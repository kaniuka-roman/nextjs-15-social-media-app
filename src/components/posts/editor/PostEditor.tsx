'use client'
import { useSession } from '@/app/(main)/SessionProvider'
import { LoadingButton } from '@/components/LoadingButton'
import { UserAvatar } from '@/components/UserAvatar'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useSubmitPostMutation } from './mutations'
import './styles.css'
import { useMediaUpload } from './useMediaUpload'
import { AddAttachmentsButton } from './components/AttachmentButton'
import { AttachmentPreviews } from './components/AttachmentPreviews'
import { Loader2 } from 'lucide-react'
import { useDropzone } from '@uploadthing/react'
import { cn } from '@/lib/utils'
import { ClipboardEvent } from 'react'

export const PostEditor = () => {
   const { user } = useSession()
   const mutation = useSubmitPostMutation()
   const {
      attachments,
      isUploading,
      removeAttachment,
      reset: resetMediaUploads,
      startUpload,
      uploadProgress,
   } = useMediaUpload()
   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: startUpload })
   const { onClick, ...rootProps } = getRootProps()
   const editor = useEditor({
      extensions: [
         StarterKit.configure({ bold: false, italic: false }),
         Placeholder.configure({ placeholder: "What's crack-a-lacin'?" }),
      ],
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
   })
   const input =
      editor?.getText({
         blockSeparator: '\n',
      }) || ''
   const onSubmit = () => {
      mutation.mutate(
         { content: input, mediaIds: attachments.map((attach) => attach.mediaId).filter(Boolean) as string[] },
         {
            onSuccess: () => {
               editor?.commands.clearContent()
               resetMediaUploads()
            },
         }
      )
   }

   const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
      const files = Array.from(e.clipboardData.items)
         .filter((item) => item.kind === 'file')
         .map((item) => item.getAsFile()) as File[]
      startUpload(files)
   }

   return (
      <div className="flex flex-col gap-5 p-5 shadow-sm rounded-2xl bg-card">
         <div className="flex gap-5">
            <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
            <div {...rootProps} className="w-full">
               <EditorContent
                  editor={editor}
                  className={cn('w-full max-h-[20rem] overflow-y-auto bg-background rounded-xl px-5 py-3', {
                     'outline-dashed': isDragActive,
                  })}
                  onPaste={onPaste}
               />
               <input {...getInputProps()} />
            </div>
         </div>
         {!!attachments.length && <AttachmentPreviews attachments={attachments} removeAttachment={removeAttachment} />}
         <div className="flex justify-end">
            {isUploading && (
               <>
                  <span className="text-sm">{uploadProgress ?? 0}%</span>
                  <Loader2 className="size-5 animate-spin text-primary" />
               </>
            )}
            <AddAttachmentsButton onFilesSelected={startUpload} disabled={isUploading || attachments.length >= 5} />
            <LoadingButton loading={mutation.isPending} onClick={onSubmit} disabled={isUploading} className="min-w-20">
               Post
            </LoadingButton>
         </div>
      </div>
   )
}
