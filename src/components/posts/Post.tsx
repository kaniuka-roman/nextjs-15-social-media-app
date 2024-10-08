'use client'
import Link from 'next/link'
import { UserAvatar } from '../UserAvatar'
import { formatRelativeDate } from '@/lib/utils'
import { PostType } from '@/controllers/posts'
import { useSession } from '@/app/(main)/SessionProvider'
import { PostMoreButton } from './components/PostMoreButton'
import { Linkify } from '../Linkify'
import { UserTooltip } from '../UserTooltip'
import { MediaPreviews } from './components/MediaPreviews'
import { LikeButton } from './components/LikeButton'
import { BookmarkButton } from './components/BookmarkButton'
import { useState } from 'react'
import { CommentButton } from './components/CommentButton'
import { Comments } from '../comments/Comments'

type PostProps = {
   post: PostType
}

export const Post = ({ post }: PostProps) => {
   const { user } = useSession()
   const [showComments, setShowComments] = useState(false)

   return (
      <article className='group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm'>
         <div className='flex justify-between gap-3'>
            <div className='flex flex-wrap gap-3'>
               <UserTooltip user={post.user}>
                  <Link href={`/users/${post.user.username}`}>
                     <UserAvatar avatarUrl={post.user.avatarUrl} />
                  </Link>
               </UserTooltip>
               <div>
                  <UserTooltip user={post.user}>
                     <Link href={`/users/${post.user.username}`} className='block font-medium hover:underline'>
                        {post.user.displayName}
                     </Link>
                  </UserTooltip>
                  <Link
                     href={`/posts/${post.id}`}
                     className='block text-sm text-muted-foreground hover:underline'
                     suppressHydrationWarning
                  >
                     {formatRelativeDate(post.createdAt)}
                  </Link>
               </div>
            </div>
            {post.userId === user.id && (
               <PostMoreButton post={post} className='opacity-0 transition-opacity group-hover/post:opacity-100' />
            )}
         </div>
         <Linkify>
            <div className='whitespace-pre-line break-words'>{post.content}</div>
         </Linkify>
         {!!post.attachments.length && <MediaPreviews attachments={post.attachments} />}
         <hr className='text-muted-foreground' />
         <div className='flex justify-between gap-5'>
            <div className='flex items-center gap-5'>
               <LikeButton
                  postId={post.id}
                  initialState={{ likes: post._count.likes, isLikedByUser: !!post.likes.length }}
               />
               <CommentButton post={post} onClick={() => setShowComments(!showComments)} />
            </div>
            <BookmarkButton postId={post.id} initialState={{ isBookmarkedByUser: !!post.bookmarks.length }} />
         </div>
         {showComments && <Comments post={post} />}
      </article>
   )
}
