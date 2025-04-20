import { Outlet } from "react-router";
import grid from "../../assets/grid.svg";
import gildore_logo from "../../assets/gildore_logo.png";

import { useNavigate } from "react-router";

import { usePrivy } from '@privy-io/react-auth';

import { useEffect } from "react";

export const AuthLayout = () => {
    const { ready, authenticated } = usePrivy();
    const navigate = useNavigate();

    useEffect(() => {
        if(ready && authenticated) {
            navigate("/dashboard")
        }
    }, [ready, authenticated, navigate]);

  return (
    <div className="flex flex-col w-full h-screen max-h-screen overflow-y-hidden">
      <img src={grid} className="absolute z-1 top-0 left-0 w-full" />
      <div className="relative z-2 w-full h-full flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <img src={gildore_logo} alt="Gildore Logo" className=" w-10" />
          <span className="text-white font-extrabold text-xl tracking-wider anton">
            GILDORE
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
