import { AnalyticsCard } from './AnalyticsCard'

export const AnalyticsCards = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4 px-4'>
        <AnalyticsCard />
        <AnalyticsCard type="gold" />
        <AnalyticsCard type="silver" />
    </div>
  )
}
