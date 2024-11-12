import {
  BarChart2Icon,
  LayoutPanelLeftIcon,
  MessageCircleIcon,
  NotebookTextIcon,
  SettingsIcon,
} from "lucide-react";

export const routesNames: Record<string, string> = {
  dashboard: "Dashboard",
  forms: "Forms",
  settings: "Settings",
};

export const navRoutes = [
  // {
  //   title: "Dashboard",
  //   route: "/dashboard",
  //   icon: LayoutPanelLeftIcon,
  // },
  // {
  //   title: "Analytics",
  //   route: "/dashboard/analytics",
  //   icon: BarChart2Icon,
  // },
  {
    title: "Forms",
    route: "/dashboard/forms",
    icon: NotebookTextIcon,
  },
  {
    title: "Responses",
    route: "/dashboard/responses",
    icon: MessageCircleIcon,
  },
  // {
  //   title: "Settings",
  //   route: "/dashboard/settings",
  //   icon: SettingsIcon,
  //   end: true,
  // },
];
