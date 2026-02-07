export interface SidebarItem {
  name: string;
  link: string;
  icon: string;
  adminOnly?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: "dashboard_icon",
  },
  {
    name: "MarketPlace",
    link: "/dashboard/marketplace",
    icon: "marketplace_icon",
  },
  {
    name: "Portfolio",
    link: "/dashboard/portfolio",
    icon: "portfolio_icon",
  },
  {
    name: "Admin",
    link: "/dashboard/admin",
    icon: "admin_icon",
    adminOnly: true,
  },
  {
    name: "Settings",
    link: "/dashboard/settings",
    icon: "settings_icon",
  },
];
