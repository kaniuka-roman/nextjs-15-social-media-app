'use client'

import { useSession } from '@/app/(main)/SessionProvider'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuPortal,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { UserAvatar } from './UserAvatar'
import Link from 'next/link'
import { Check, CircleUserRound, LogOutIcon, Monitor, Moon, Sun, UserIcon } from 'lucide-react'
import { logout } from '@/app/(auth)/action'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useQueryClient } from '@tanstack/react-query'

type UserButtonProps = {
   className?: string
}

const themes = [
   {
      name: 'system',
      text: 'System default',
      icon: Monitor,
   },
   {
      name: 'light',
      text: 'Light',
      icon: Sun,
   },
   {
      name: 'dark',
      text: 'Dark',
      icon: Moon,
   },
]

export const UserButton = ({ className }: UserButtonProps) => {
   const { user } = useSession()
   const { theme, setTheme } = useTheme()
   const queryClient = useQueryClient()
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <button className={cn('flex-none rounded-full bg-secondary p-1', className)}>
               <UserAvatar avatarUrl={user.avatarUrl} size={32} />
            </button>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
            <DropdownMenuLabel>Logged in as@{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/users/${user.username}`}>
               <DropdownMenuItem className='cursor-pointer'>
                  <UserIcon className='mr-2 size-4' />
                  Profie
               </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
               <DropdownMenuSubTrigger className='cursor-pointer'>
                  <Monitor className='mr-2 size-4' />
                  Theme
               </DropdownMenuSubTrigger>
               <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                     {themes.map(({ name, text, icon }) => {
                        const Icon = icon
                        return (
                           <DropdownMenuItem
                              key={name}
                              className='min-w-max cursor-pointer'
                              onClick={() => setTheme(name)}
                           >
                              <Icon className='mr-2 size-4' />
                              {text}
                              <div className='ml-auto h-4 min-w-6 pl-2'>
                                 {theme === name && <Check className='size-4' />}
                              </div>
                           </DropdownMenuItem>
                        )
                     })}
                  </DropdownMenuSubContent>
               </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
               className='cursor-pointer'
               onClick={() => {
                  queryClient.clear()
                  logout()
               }}
            >
               <LogOutIcon className='mr-2 size-4' />
               Logout
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
