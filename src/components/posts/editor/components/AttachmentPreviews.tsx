import { cn } from '@/lib/utils'
import { Attachment } from '../useMediaUpload'
import Image from 'next/image'
import { X } from 'lucide-react'

type AttachmentPreviewsProps = {
   attachments: Attachment[]
   removeAttachment: (fileName: string) => void
}

export const AttachmentPreviews = ({ attachments, removeAttachment }: AttachmentPreviewsProps) => {
   return (
      <div className={cn('flex flex-col gap-3', { 'sm:grid sm:grid-cols-2': attachments.length > 1 })}>
         {attachments.map((attachment) => (
            <AttachmentPreview
               key={attachment.file.name}
               attachment={attachment}
               onRemoveClick={() => removeAttachment(attachment.file.name)}
            />
         ))}
      </div>
   )
}

type AttachmentPreviewProps = {
   attachment: Attachment
   onRemoveClick: () => void
}

const AttachmentPreview = ({ attachment: { file, mediaId, isUploading }, onRemoveClick }: AttachmentPreviewProps) => {
   const src = URL.createObjectURL(file)
   return (
      <div className={cn('relative mx-auto size-fit', { 'opacity-50': isUploading })}>
         {file.type.startsWith('image') ? (
            <Image
               src={src}
               alt="Attachment preview"
               width={500}
               height={500}
               className="size-fit max-h-[30rem] rounded-2xl"
            />
         ) : (
            <video controls className="max-h-[30rem] rounded-2xl size-fit">
               <source src={src} type={file.type} />
            </video>
         )}
         {!isUploading && (
            <button
               className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
               onClick={onRemoveClick}
            >
               <X size={20} />
            </button>
         )}
      </div>
   )
}
