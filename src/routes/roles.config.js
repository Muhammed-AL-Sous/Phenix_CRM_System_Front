import { lazy } from "react";

import UsersPage from "../features/users/pages/UsersPage.jsx";

// =================== Shared =================== //
const ClientsPage = lazy(
  () => import("../features/clients/pages/ClientsPage.jsx"),
);

const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage.jsx"),
);

const ProfilePage = lazy(
  () => import("../features/dashboard/pages/ProfilePage.jsx"),
);

const StaffPage = lazy(() => import("../features/staff/pages/StaffPage.jsx"));

const StaffClientProfilePage = lazy(
  () => import("../features/clients/pages/StaffClientProfilePage.jsx"),
);

const TasksPage = lazy(() => import("../features/tasks/pages/TasksPage.jsx"));

const TicketsPage = lazy(
  () => import("../features/tickets/pages/TicketsPage.jsx"),
);

const ChatPage = lazy(() => import("../features/chat/pages/ChatPage.jsx"));

const RatingsPage = lazy(
  () => import("../features/ratings/pages/RatingsPage.jsx"),
);

// Icons
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Tickets,
  ListTodo,
  SendToBack,
  Settings,
  MessageCircleMore,
  UserStar,
  Crown,
  Handshake,
  HeartPlus,
} from "lucide-react";

import {
  IconAllUsers,
  IconClients,
  IconStaff,
  IconUsers,
} from "../components/icons/SidebarUsersIcons.jsx";

// =================== Admin =================== //

const AdminStats = lazy(
  () => import("../features/admin/components/AdminStats.jsx"),
);

// =================== Support =================== //

const SupportStats = lazy(
  () => import("../features/support/components/SupportStats.jsx"),
);

// =================== Client =================== //

const ClientRequestsPage = lazy(
  () => import("../features/clients/pages/ClientRequestsPage.jsx"),
);

const ClientStats = lazy(
  () => import("../features/clients/components/ClientStats.jsx"),
);

const CompleteClientProfilePage = lazy(
  () => import("../features/clients/pages/CompleteClientProfilePage.jsx"),
);

const ProspectiveClientsPage = lazy(
  () => import("../features/clients/pages/ProspectiveClientsPage.jsx"),
);



export const ROLES_CONFIG = {
  admin: {
    prefix: "admin",
    statsComponent: AdminStats,

    sidebar: [
      { icon: LayoutDashboard, label: "dashboard", to: "/admin" },
      { icon: Tickets, label: "tickets", to: "/admin/tickets" },
      { icon: ListTodo, label: "tasks", to: "/admin/tasks" },
      {
        key: "users_menu",
        icon: IconUsers,
        label: "users",
        children: [
          { icon: IconAllUsers, label: "all_users", to: "/admin/users" },
          { icon: IconStaff, label: "staff", to: "/admin/staff" },
          { icon: IconClients, label: "clients", to: "/admin/clients" },
        ],
      },
      { icon: MessageCircleMore, label: "chat", to: "/admin/chat" },
      { icon: UserStar, label: "ratings", to: "/admin/ratings" },
      {
        icon: Crown,
        label: "prospective_clients",
        to: "/admin/prospective-clients",
      },
      { icon: ChartNoAxesCombined, label: "reports", to: "/admin/reports" },
      { icon: Settings, label: "settings", to: "/admin/settings" },
    ],

    routes: [
      { path: "", element: DashboardPage },
      { path: "tickets", element: TicketsPage },
      { path: "tasks", element: TasksPage },
      { path: "profile", element: ProfilePage },
      { path: "users", element: UsersPage },
      { path: "staff", element: StaffPage },
      { path: "clients", element: ClientsPage },
      { path: "clients/:clientId", element: StaffClientProfilePage },
      { path: "chat", element: ChatPage },
      { path: "ratings", element: RatingsPage },
      { path: "prospective-clients", element: ProspectiveClientsPage },
    ],
  },

  manager: {
    prefix: "manager",
    statsComponent: AdminStats,

    sidebar: [
      { icon: LayoutDashboard, label: "dashboard", to: "/manager" },
      { icon: Tickets, label: "tickets", to: "/manager/tickets" },
      { icon: ListTodo, label: "tasks", to: "/manager/tasks" },
      { icon: IconAllUsers, label: "client_users", to: "/manager/users" },
      { icon: Handshake, label: "clients", to: "/manager/clients" },
      { icon: MessageCircleMore, label: "chat", to: "/manager/chat" },
      { icon: UserStar, label: "ratings", to: "/manager/ratings" },
      {
        icon: Crown,
        label: "prospective_clients",
        to: "/manager/prospective-clients",
      },
      { icon: ChartNoAxesCombined, label: "reports", to: "/manager/reports" },
      { icon: Settings, label: "settings", to: "/manager/settings" },
    ],

    routes: [
      { path: "", element: DashboardPage },
      { path: "tickets", element: TicketsPage },
      { path: "tasks", element: TasksPage },
      { path: "profile", element: ProfilePage },
      { path: "users", element: UsersPage },
      { path: "clients", element: ClientsPage },
      { path: "clients/:clientId", element: StaffClientProfilePage },
      { path: "chat", element: ChatPage },
      { path: "ratings", element: RatingsPage },
      { path: "prospective-clients", element: ProspectiveClientsPage },
    ],
  },

  support: {
    prefix: "support",
    statsComponent: SupportStats,

    sidebar: [
      { icon: LayoutDashboard, label: "dashboard", to: "/support" },
      { icon: Tickets, label: "tickets", to: "/support/tickets" },
      { icon: ListTodo, label: "tasks", to: "/support/tasks" },
      { icon: IconAllUsers, label: "client_users", to: "/support/users" },
      { icon: Handshake, label: "clients", to: "/support/clients" },
      { icon: UserStar, label: "ratings", to: "/support/ratings" },
      {
        icon: Crown,
        label: "prospective_clients",
        to: "/support/prospective-clients",
      },
      { icon: MessageCircleMore, label: "chat", to: "/support/chat" },
    ],

    routes: [
      { path: "", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "tickets", element: TicketsPage },
      { path: "tasks", element: TasksPage },
      { path: "users", element: UsersPage },
      { path: "clients", element: ClientsPage },
      { path: "clients/:clientId", element: StaffClientProfilePage },
      { path: "ratings", element: RatingsPage },
      { path: "prospective-clients", element: ProspectiveClientsPage },
      { path: "chat", element: ChatPage },
    ],
  },

  client: {
    prefix: "client",
    statsComponent: ClientStats,

    sidebar: [
      { icon: LayoutDashboard, label: "dashboard", to: "/client" },
      { icon: Tickets, label: "tickets", to: "/client/tickets" },
      { icon: SendToBack, label: "my_requests", to: "/client/requests" },
      { icon: MessageCircleMore, label: "chat", to: "/client/chat" },
      {
        icon: Handshake,
        label: "add_your_opinion",
        to: "/client/testimonials",
      },
      { icon: HeartPlus, label: "support_plan", to: "/client/support-plan" },
    ],

    routes: [
      { path: "complete-profile", element: CompleteClientProfilePage },
      { path: "", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "tickets", element: TicketsPage },
      { path: "requests", element: ClientRequestsPage },
      { path: "chat", element: ChatPage },
    ],
  },
};
