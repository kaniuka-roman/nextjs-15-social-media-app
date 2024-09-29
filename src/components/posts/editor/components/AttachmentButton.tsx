import { Button } from '@/components/ui/button'
import { ImageIcon } from 'lucide-react'
import { useRef } from 'react'

type AddAttachmentsButtonProps = {
   onFilesSelected: (files: File[]) => void
   disabled: boolean
}

export const AddAttachmentsButton = ({ disabled, onFilesSelected }: AddAttachmentsButtonProps) => {
   const fileInputRef = useRef<HTMLInputElement>(null)
   return (
      <>
         <Button
            variant={'ghost'}
            size={'icon'}
            className="text-primary hover:text-primary"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
         >
            <ImageIcon size={20} />
         </Button>
         <input
            type="file"
            accept="image/*, video/*"
            multiple
            ref={fileInputRef}
            className="hidden sr-only"
            onChange={(e) => {
               const files = Array.from(e.target.files || [])
               if (files.length) {
                  onFilesSelected(files)
                  e.target.value = ''
               }
            }}
         />
      </>
   )
}
