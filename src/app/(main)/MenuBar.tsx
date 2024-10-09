import { Button } from '@/components/ui/button'
import { Bookmark, Home, Mail } from 'lucide-react'
import Link from 'next/link'
import { NotificationsButton } from './notifications/components/NotificationsButton'
import { validateRequest } from '@/auth'
import { getUnreadNotificationsCount } from '@/controllers/notifications'

type MenuBarProps = {
   className?: string
}
export const MenuBar = async ({ className }: MenuBarProps) => {
   const { user } = await validateRequest()
   if (!user) return null
   const unreadNotificationsCount = await getUnreadNotificationsCount({ recipientId: user.id })

   const menuItems = [
      {
         name: 'Home',
         path: '/',
         icon: Home,
      },
      {
         component: <NotificationsButton initialState={{ unreadCount: unreadNotificationsCount }} />,
      },
      {
         name: 'Messages',
         path: '/messages',
         icon: Mail,
      },
      {
         name: 'Bookmarks',
         path: '/bookmarks',
         icon: Bookmark,
      },
   ]
   return (
      <div className={className}>
         {menuItems.map(({ name, path, icon, component }) => {
            if (component) return component
            const Icon = icon
            return (
               <Button
                  key={name}
                  variant={'ghost'}
                  className='flex items-center justify-start gap-3'
                  title={name}
                  asChild
               >
                  <Link href={path}>
                     <Icon />
                     <span className='hidden lg:inline'>{name}</span>
                  </Link>
               </Button>
            )
         })}
      </div>
   )
}
