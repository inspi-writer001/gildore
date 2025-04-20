import gildore_logo from "../../assets/gildore_logo.svg";

export const DashboardHeader = () => {
  return (
    <div className="w-full h-14 bg-card flex items-center justify-between md:justify-end px-4">
        <img src={gildore_logo} alt="Gildore Logo" className="w-[121px] h-auto block md:hidden" />
        <div className="flex items-center">
            <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-[#D9D9D9]" />
        </div>
    </div>
  )
}
