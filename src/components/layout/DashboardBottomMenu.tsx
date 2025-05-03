import { NavLink } from "react-router";
import { cn } from "../../utils";
import { sidebarItems } from "../../constant/menu";

export const DashboardBottomMenu = () => {
  return (
    <div className="sticky bottom-0 left-0 mt-4 right-0 block md:hidden z-100">
      <div className="flex items-center justify-between bg-card p-4 border-t border-t-gray-100/10">
        {sidebarItems.map((item) => (
          <NavLink
            to={item.link}
            end
            className={({ isActive, isPending, isTransitioning }) =>
              [
                "text-sm font-medium inline-flex flex-col items-center gap-2",
                isPending ? "text-[#6C6C6C]" : "",
                isTransitioning ? "animate-pulse" : "",
                isActive ? "text-white font-bold gap-2" : "",
              ].join("")
            }
          >
            {({ isActive, isPending }) => (
              <>
                <img
                  src={`/images/dashboard/${item.icon}${
                    isActive ? "_active" : "_inactive"
                  }.svg`}
                  alt={item.name}
                  className="w-5 md:w-6 h-5 md:h-6 flex-shrink-0"
                />

                <p
                  className={cn(
                    "text-xs font-medium",
                    isActive && "text-white font-bold",
                    isPending && "text-[#6C6C6C]"
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
