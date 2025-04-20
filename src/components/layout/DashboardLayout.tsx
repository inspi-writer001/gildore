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
    <div className="flex flex-col w-[100vw] h-[100vh] overflow-hidden">
      <img src={grid} className="top-0 left-0 w-full" />

      {/* content */}
      <div className="absolute w-screen h-screen flex gap-0">
        <DashboardSidebar />

        <div className="w-full h-full flex flex-col gap-4">
            <DashboardHeader />
            <Outlet />
        </div>
      </div>

      <DashboardBottomMenu />
    </div>
  );
};
