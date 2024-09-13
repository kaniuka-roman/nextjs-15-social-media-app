import avatarPlaceholder from '@/assets/avatar-placeholder.png'
import { cn } from '@/lib/utils'
import { CircleUserRound } from 'lucide-react'
import Image from 'next/image'

type UserAvatarProps = {
   avatarUrl: string | null | undefined
   size?: number
   className?: string
}

export const UserAvatar = ({ avatarUrl, size, className }: UserAvatarProps) => {
   return (
      <>
         {avatarUrl ? (
            <Image
               src={avatarUrl || avatarPlaceholder}
               alt="user avatar"
               width={size ?? 48}
               height={size ?? 48}
               className={cn('aspect-square h-fit flex-none rounded-full bg-secondary object-cover', className)}
            />
         ) : (
            <CircleUserRound strokeWidth={1} width={size ?? 48} height={size ?? 48} />
         )}
      </>
   )
}
