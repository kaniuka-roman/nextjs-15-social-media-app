import { Button } from '@/components/ui/button'
import { Bell, Bookmark, Home, Mail } from 'lucide-react'
import Link from 'next/link'

type MenuBarProps = {
   className?: string
}
const menuItems = [
   {
      name: 'Home',
      path: '/',
      icon: Home,
   },
   {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
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
export const MenuBar = ({ className }: MenuBarProps) => {
   return (
      <div className={className}>
         {menuItems.map(({ name, path, icon }) => {
            const Icon = icon
            return (
               <Button key={name} variant={'ghost'} className="flex items-center justify-start gap-3" title={name} asChild>
                  <Link href={path}>
                     <Icon />
                     <span className="hidden lg:inline">{name}</span>
                  </Link>
               </Button>
            )
         })}
      </div>
   )
}
