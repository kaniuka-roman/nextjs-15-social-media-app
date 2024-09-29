import { cn } from '@/lib/utils'
import { Media } from '@prisma/client'
import Image from 'next/image'

export type MediaPreviewsProps = {
   attachments: Media[]
}

export const MediaPreviews = ({ attachments }: MediaPreviewsProps) => {
   return (
      <div className={cn('flex flex-col gap-3', { 'sm:grid sm:grid-cols-2': attachments.length > 1 })}>
         {attachments.map((attachment) => (
            <MediaPreview key={attachment.id} media={attachment} />
         ))}
      </div>
   )
}

type MediaPreviewProps = {
   media: Media
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
   if (media.type === 'IMAGE')
      return (
         <Image
            src={media.url}
            alt="Attachment"
            width={500}
            height={500}
            className="mx-auto size-fit max-h-[30rem] rounded-2xl"
         />
      )
   if (media.type === 'VIDEO')
      return (
         <div>
            <video src={media.url} controls className="mx-auto size-fit max-h-[30rem] rounded-2xl" />
         </div>
      )
   return <p className="text-destructive">Unsupported media type</p>
}
