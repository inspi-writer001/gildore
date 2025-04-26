import { createBrowserRouter } from "react-router";

import { Home } from "../pages/home";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Auth } from "../pages/auth";
import { Dashboard } from "../pages/dashboard";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Marketplace } from "../pages/dashboard/marketplace";
import { Porfolio } from "../pages/dashboard/portfolio";
import {DashboardSettingsLayout} from "../components/layout/DashboardSettingsLayout.tsx";
import {DashboardSettingsIndex} from "../pages/dashboard/settings";
import {BankSettings} from "../pages/dashboard/settings/bank.tsx";
import {AddressSettings} from "../pages/dashboard/settings/address.tsx";
import {DashboardSettingsPersonal} from "../pages/dashboard/settings/personal.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Auth,
      },
    ],
  },
  {
    path: "dashboard",
    Component: DashboardLayout,
    children: [
        {
            index: true,
            Component: Dashboard
        },
        {
            path: "marketplace",
            Component: Marketplace
        },
        {
            path: "portfolio",
            Component: Porfolio
        },
        {
            path: "settings",
            Component: DashboardSettingsLayout,
            children: [
                {
                    index: true,
                    Component: DashboardSettingsIndex
                },
                {
                    path: "personal",
                    Component: DashboardSettingsPersonal
                },
                {
                    path: "bank",
                    Component: BankSettings
                },
                {
                    path: "address",
                    Component: AddressSettings
                }
            ]
        }
    ]
  }
]);
