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

export const ROLES_CONFIG = {
  admin: {
    prefix: "admin",
    statsComponent: AdminStats,

    sidebar: [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Users", to: "/admin/users" },
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
      { label: "Dashboard", to: "/support/dashboard" },
      { label: "Tickets", to: "/support/tickets" },
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
      { label: "Dashboard", to: "/customer/dashboard" },
      { label: "My Requests", to: "/customer/requests" },
    ],

    routes: [
      { path: "dashboard", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "requests", element: CustomerRequestsPage },
    ],
  },
};
