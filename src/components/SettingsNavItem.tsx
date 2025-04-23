import {NavLink, useLocation} from "react-router";
import {cn} from "../lib/utils.ts";

export const SettingsNavItem = ({
    to,
    children,
                                }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    
    return (
        <NavLink
            to={to}
            className={cn(
                "flex w-full items-center gap-3 py-6 font-normal font-glory transition-colors group",
                isActive ? 'text-white' : 'text-white/50 hover:text-white',
            )}
        >
            <span>{children}</span>
            <span className="ml-auto text-gray-400 transition duration-200 delay-100 group-hover:translate-x-0.5">›</span>
        </NavLink>
    )
}
