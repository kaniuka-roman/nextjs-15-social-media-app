import { Metadata } from 'next'
import { Chat } from './components/Chat'

export const metadata: Metadata = {
   title: 'Messages',
}

export default function Page() {
   return <Chat />
}
