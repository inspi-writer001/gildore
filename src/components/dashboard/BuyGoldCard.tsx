
export const BuyGoldCard = () => {
  return (
    <div className="w-full h-full md:col-span-1 bg-card flex md:flex-col justify-between items-center relative px-6 py-8 pt-4 md:pt-14 cursor-pointer overflow-hidden">
        <div>
            <h3 className="anton text-left md:text-center uppercase text-white text-lg md:text-2xl">Buy gildore Gold & Silver</h3>
            <p className="text-left md:text-center text-xs md:text-sm">Buy Gold & Silver from the list in our marketplace</p>
        </div>

        <img src="/images/dashboard/gold-bar.png" className="w-[140px] md:w-[300px] h-auto -mb-12 z-10" />

        <img src="/images/dashboard/analytics-card-pattern-gold.svg" className="absolute -bottom-2 md:bottom-0 left-0 w-full h-auto" />
    </div>
  )
}
