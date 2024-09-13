import { PostEditor } from '@/components/posts/editor/PostEditor'
import { ForYouFeed } from '../ForYouFeed'

export default async function Home() {
   return (
      <main className="min-w-0 w-full">
         <div className="w-full min-w-0 space-y-5">
            <PostEditor />
            <ForYouFeed />
         </div>
      </main>
   )
}
