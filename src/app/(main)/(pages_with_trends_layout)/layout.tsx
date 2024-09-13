import { TrendsSidebar } from '@/components/TrendsSidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <section className="w-full flex gap-5">
         {children}
         <TrendsSidebar />
      </section>
   )
}
