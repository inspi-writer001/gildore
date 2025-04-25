import {Outlet} from "react-router";
import {SettingsNavItem} from "../SettingsNavItem.tsx";

export const DashboardSettingsLayout = () => {
    return (
        <div className="flex flex-1 gap-4 text-white">
            {/* Left Sidebar */}
            <div className="w-[346px] bg-card py-6">
                <div className="mb-6 px-6 flex items-center gap-2">
                    <img
                        src={`/src/assets/dashboard/settings_icon_active.svg`}
                        alt="Settings Icon"
                        className="w-6 h-6 flex-shrink-0"
                    />
                    <h2 className="text-xl font-bold font-impact uppercase">Settings</h2>
                </div>

                <nav className="flex flex-col divide-y divide-white/5 space-y-1 px-6">
                    <SettingsNavItem to="/dashboard/settings">
                        Personal Details
                    </SettingsNavItem>
                    <SettingsNavItem to="/dashboard/settings/bank">
                        Bank Details
                    </SettingsNavItem>
                    <SettingsNavItem to="/dashboard/settings/currency">
                        Native Currency
                    </SettingsNavItem>
                    <SettingsNavItem to="/dashboard/settings/address">
                        Address
                    </SettingsNavItem>
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-card p-8 pt-[6.813rem]">
                <Outlet/>
            </div>
        </div>
    )
}
