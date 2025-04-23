import { Outlet } from "react-router";
import grid from "../../assets/grid.svg";

import { useNavigate } from "react-router";

import { usePrivy } from '@privy-io/react-auth';

import { useEffect } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardBottomMenu } from "./DashboardBottomMenu";

export const DashboardLayout = () => {
    const { ready, authenticated } = usePrivy();
    const navigate = useNavigate();

    useEffect(() => {
        if(ready && !authenticated) {
            navigate("/auth")
        }
    }, [ready, authenticated, navigate]);

  return (
    <div className="flex flex-col p-4 isolate relative min-h-screen flex-1">
        <div className="inset-0 absolute -z-10">
          <img src={grid} className="object-cover h-full w-full" alt="grid"/>
        </div>

      {/* content */}
      <div className="flex flex-1 gap-4 h-full">
          <div className="w-[214px] hidden md:block shrink-0 bg-card">
            <DashboardSidebar />
          </div>

        <div className="flex-1 flex flex-col gap-4">
            <DashboardHeader />
            <div className="flex-1 flex flex-col">
                <Outlet />
            </div>
        </div>
      </div>

      <DashboardBottomMenu />
    </div>
  );
};
