import gildore_logo from "../../assets/gildore_logo.svg";
import { NavLink } from "react-router";
import { cn } from "../../utils";
import { sidebarItems } from "../../constant/menu";

export const DashboardSidebar = () => {
  return (
    <div className="w-[214px] h-full bg-card px-5 py-6 hidden md:flex flex-col gap-16">
      <img src={gildore_logo} alt="Gildore Logo" className="w-fill h-auto" />

      <div className="flex flex-col gap-8 w-full">
        {sidebarItems.map((item) => (
          <NavLink
            to={item.link}
            end
            className={({ isActive, isPending, isTransitioning }) =>
              [
                "text-base font-medium inline-flex items-center gap-2",
                isPending ? "text-[#6C6C6C]" : "",
                isTransitioning ? "animate-pulse" : "",
                isActive ? "text-white font-bold gap-2" : "",
              ].join("")
            }
          >
            {({ isActive, isPending }) => (
              <>
                <img
                  src={`/src/assets/dashboard/${item.icon}${
                    isActive ? "_active" : "_inactive"
                  }.svg`}
                  alt={item.name}
                  className="w-6 h-6 flex-shrink-0"
                />

                <p className={cn("text-base font-medium", isActive && "text-white font-bold", isPending && "text-[#6C6C6C]")}>
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
