import { TrendsSidebar } from '@/components/TrendsSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <section className='flex w-full gap-5'>
         {children}
         <TrendsSidebar />
      </section>
   )
}
