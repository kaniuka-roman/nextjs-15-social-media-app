import { deleteUnusedMedia, getUnusedMedia } from '@/controllers/media'
import { UTApi } from 'uploadthing/server'

export const GET = async (req: Request) => {
   try {
      const authHeader = req.headers.get('Authorization')
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
         return Response.json(
            {
               message: 'Invalid authorization header',
            },
            { status: 401 }
         )
      }
      const unusedMedia = await getUnusedMedia()

      new UTApi().deleteFiles(
         unusedMedia.map((m) => m.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1])
      )
      await deleteUnusedMedia(unusedMedia)
      return new Response()
   } catch (error) {
      console.log(error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
   }
}
