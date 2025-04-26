import {NavLink, Outlet, useLocation} from "react-router";
import {SettingsNavItem} from "../SettingsNavItem.tsx";
import {useEffect, useState} from "react";

export const DashboardSettingsLayout = () => {
    const location = useLocation();
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    
    useEffect(() => {
        if (location.pathname !== '/dashboard/settings') {
            setSidebarVisible(false);
        } else {
            setSidebarVisible(true);
        }
    }, [location]);
    return (
        <div className="flex flex-1 gap-4 text-white">
            {/* Left Sidebar */}
            <div className={`w-full md:max-w-[346px] ${isSidebarVisible ? 'block' : 'hidden md:block'} bg-card py-6`}>
                <div className="mb-6 px-6 flex items-center gap-2">
                    <img
                        src={`/src/assets/dashboard/settings_icon_active.svg`}
                        alt="Settings Icon"
                        className="w-6 h-6 flex-shrink-0"
                    />
                    <h2 className="text-xl font-bold font-impact uppercase">Settings</h2>
                </div>

                <nav className="flex flex-col divide-y divide-white/5 space-y-1 px-6">
                    <SettingsNavItem to="/dashboard/settings/personal">
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
                    <div className={`bg-card flex-1 p-4 md:p-8 ${location.pathname !== '/dashboard/settings' ? '' : 'hidden md:block'}`}>
                        <NavLink to={'/dashboard/settings'} className='flex md:hidden transition-all active:-scale-0.5 items-center text-sm gap-1'>
                            <img src={'/src/assets/dashboard/arrow-left.svg'} className='w-4 h-4' alt={'back'} />
                            Go Back
                        </NavLink>
                        <div className="pt-10 md:pt-[6.813rem]">
                            <Outlet/>
                        </div>
                    </div>
        </div>
    );
};
