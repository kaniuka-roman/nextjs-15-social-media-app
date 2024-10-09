import { UserAvatar } from '@/components/UserAvatar'
import { NotificationData } from '@/controllers/notifications'
import { cn } from '@/lib/utils'
import { NotificationType } from '@prisma/client'
import { Heart, MessageCircle, User2 } from 'lucide-react'
import Link from 'next/link'

export type NotificationProps = {
   notification: NotificationData
}

export const Notification = ({ notification }: NotificationProps) => {
   const notificationTypeMap: Record<NotificationType, { message: string; icon: JSX.Element; href: string }> = {
      FOLLOW: {
         message: `${notification.issuer.displayName} followed you`,
         icon: <User2 className='size-7 text-primary' />,
         href: `/user/${notification.issuer.username}`,
      },
      COMMENT: {
         message: `${notification.issuer.displayName} commented on your post`,
         icon: <MessageCircle className='size-7 fill-primary text-primary' />,
         href: `/posts/${notification.postId}`,
      },
      LIKE: {
         message: `${notification.issuer.displayName} liked your post`,
         icon: <Heart className='size-7 fill-red-500 text-red-500' />,
         href: `/posts/${notification.postId}`,
      },
   }
   const { message, icon, href } = notificationTypeMap[notification.type]
   return (
      <Link href={href} className='block'>
         <article
            className={cn('flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70', {
               'bg-primary/10': !notification.read,
            })}
         >
            <div className='my-1'>{icon}</div>
            <div className='space-y-3'>
               <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
               <div>
                  <span className='font-bold'>{notification.issuer.displayName}</span> <span>{message}</span>
               </div>
               {notification.post && (
                  <div className='line-clamp-3 whitespace-pre-line text-muted-foreground'>
                     {notification.post.content}
                  </div>
               )}
            </div>
         </article>
      </Link>
   )
}
