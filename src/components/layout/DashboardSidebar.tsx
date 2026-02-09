import gildore_logo from "../../assets/gildore_logo.png";
import { NavLink } from "react-router";
import { cn } from "../../utils";
import { sidebarItems } from "../../constant/menu";
import { useIsAdmin } from "../../hooks/useIsAdmin";

export const DashboardSidebar = () => {
  const isAdmin = useIsAdmin();

  const visibleItems = sidebarItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  return (
    <div className="flex flex-col gap-16 sticky top-0 flex-grow py-6">
      <div className="flex items-center gap-2">
        <img src={gildore_logo} alt="Gildore Logo" className=" w-25 -mr-8" />
        <span className="text-white font-extrabold text-xl tracking-wider anton">
          GILDORE
        </span>
      </div>
      {/* <div className="px-6">
                  <img src={gildore_logo} alt="Gildore Logo" className="w-fill h-auto" />
                </div> */}
      <div className="flex flex-col gap-8 w-full">
        {visibleItems.map((item) => (
          <NavLink
            key={item.link}
            to={item.link}
            end={
              item.link != "/dashboard/settings" &&
              item.link != "/dashboard/admin"
            }
            className={({ isActive, isPending, isTransitioning }) =>
              cn(
                "text-base font-medium inline-flex font-glory items-center px-6 gap-4",
                isPending && "text-[#6C6C6C]",
                isTransitioning && "animate-pulse",
                isActive ? "text-white font-bold gap-4" : "text-[#6C6C6C]",
              )
            }
          >
            {({ isActive, isPending }) => (
              <>
                <img
                  src={`/images/dashboard/${item.icon}${
                    isActive ? "_active" : "_inactive"
                  }.svg`}
                  alt={item.name}
                  className="w-6 h-6 flex-shrink-0"
                />

                <p
                  className={cn(
                    "text-base font-medium",
                    isActive && "text-white font-bold",
                    isPending && "text-[#6C6C6C]",
                  )}
                >
                  {item.name}
                </p>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
