import { lazy } from "react";

const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage.jsx"),
);

const ProfilePage = lazy(
  () => import("../features/dashboard/pages/ProfilePage.jsx"),
);

const UsersPage = lazy(() => import("../features/admin/pages/UsersPage.jsx"));

const TicketsPage = lazy(
  () => import("../features/support/pages/TicketsPage.jsx"),
);

const CustomerRequestsPage = lazy(
  () => import("../features/customer/pages/CustomerRequestsPage.jsx"),
);

const AdminStats = lazy(
  () => import("../features/admin/components/AdminStats.jsx"),
);

const SupportStats = lazy(
  () => import("../features/support/components/SupportStats.jsx"),
);

const CustomerStats = lazy(
  () => import("../features/customer/components/CustomerStats.jsx"),
);

// Icons
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Users,
  Tickets,
  ListTodo,
  SendToBack,
} from "lucide-react";

export const ROLES_CONFIG = {
  admin: {
    prefix: "admin",
    statsComponent: AdminStats,

    sidebar: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
      { icon: Tickets, label: "Tickets", to: "/admin/tickets" },
      { icon: ListTodo, label: "Tasks", to: "/admin/tasks" },
      { icon: Users, label: "Users", to: "/admin/users" },
      { icon: ChartNoAxesCombined, label: "Reports", to: "/admin/reports" },
    ],

    routes: [
      { path: "dashboard", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "users", element: UsersPage },
    ],
  },

  support: {
    prefix: "support",
    statsComponent: SupportStats,

    sidebar: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/support" },
      { icon: Tickets, label: "Tickets", to: "/support/tickets" },
      { icon: ListTodo, label: "Tasks", to: "/support/tasks" },
      { icon: Users, label: "Users", to: "/admin/users" },
    ],

    routes: [
      { path: "dashboard", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "tickets", element: TicketsPage },
    ],
  },

  customer: {
    prefix: "customer",
    statsComponent: CustomerStats,

    sidebar: [
      { icon: LayoutDashboard, label: "Dashboard", to: "/customer" },
      { icon: SendToBack, label: "My Requests", to: "/customer/requests" },
    ],

    routes: [
      { path: "dashboard", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "requests", element: CustomerRequestsPage },
    ],
  },
};
