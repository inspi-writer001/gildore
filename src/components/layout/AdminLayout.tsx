import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { SettingsNavItem } from "../SettingsNavItem.tsx";
import { useEffect, useState } from "react";
import { useIsAdmin } from "../../hooks/useIsAdmin";

export const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (location.pathname !== "/dashboard/admin") {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [location]);

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-card p-8 text-center">
          <h2 className="anton text-2xl uppercase text-white">Access Denied</h2>
          <p className="text-white/50 text-sm mt-2">
            Only the marketplace admin can access this page.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold uppercase tracking-wide transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 gap-4 text-white">
      <div
        className={`w-full lg:max-w-[346px] ${
          isSidebarVisible ? "block" : "hidden lg:block"
        } bg-card py-6`}
      >
        <div className="mb-6 px-6 flex items-center gap-2">
          <img
            src="/images/dashboard/admin_icon_active.svg"
            alt="Admin Icon"
            className="w-6 h-6 flex-shrink-0"
          />
          <h2 className="text-xl font-bold font-impact uppercase">Admin</h2>
        </div>

        <nav className="flex flex-col divide-y divide-white/5 space-y-1 px-6">
          <SettingsNavItem to="/dashboard/admin/create-nft">
            Create NFT
          </SettingsNavItem>
          <SettingsNavItem to="/dashboard/admin/list-nft">
            List NFT
          </SettingsNavItem>
        </nav>
      </div>

      <div
        className={`bg-card flex-1 p-4 md:p-8 ${
          location.pathname !== "/dashboard/admin" ? "" : "hidden lg:block"
        }`}
      >
        <NavLink
          to="/dashboard/admin"
          className="flex lg:hidden transition-all active:-scale-0.5 items-center text-sm gap-1"
        >
          <img
            src="/images/dashboard/arrow-left.svg"
            className="w-4 h-4"
            alt="back"
          />
          Go Back
        </NavLink>
        <div className="pt-10 md:pt-[6.813rem]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
