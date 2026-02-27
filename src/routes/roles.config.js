import { lazy } from "react";

// =================== Shared =================== //
const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage.jsx"),
);

const ProfilePage = lazy(
  () => import("../features/dashboard/pages/ProfilePage.jsx"),
);

const UsersPage = lazy(() => import("../features/users/pages/UsersPage.jsx"));

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
  Users,
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

// =================== Admin =================== //

const AdminStats = lazy(
  () => import("../features/admin/components/AdminStats.jsx"),
);

// =================== Support =================== //

const SupportStats = lazy(
  () => import("../features/support/components/SupportStats.jsx"),
);

// =================== Customer =================== //

const CustomerRequestsPage = lazy(
  () => import("../features/customer/pages/CustomerRequestsPage.jsx"),
);

const CustomerStats = lazy(
  () => import("../features/customer/components/CustomerStats.jsx"),
);

const ProspectiveCustomersPage = lazy(
  () => import("../features/customer/pages/ProspectiveCustomersPage.jsx"),
);

export const ROLES_CONFIG = {
  admin: {
    prefix: "admin",
    statsComponent: AdminStats,

    sidebar: [
      { icon: LayoutDashboard, label: "dashboard", to: "/admin" },
      { icon: Tickets, label: "tickets", to: "/admin/tickets" },
      { icon: ListTodo, label: "tasks", to: "/admin/tasks" },
      { icon: Users, label: "users", to: "/admin/users" },
      { icon: MessageCircleMore, label: "chat", to: "/admin/chat" },
      { icon: UserStar, label: "ratings", to: "/admin/ratings" },
      {
        icon: Crown,
        label: "prospective_customers",
        to: "/admin/prospective-customers",
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
      { path: "chat", element: ChatPage },
      { path: "ratings", element: RatingsPage },
      { path: "prospective-customers", element: ProspectiveCustomersPage },
    ],
  },

  support: {
    prefix: "support",
    statsComponent: SupportStats,

    sidebar: [
      { icon: LayoutDashboard, label: "dashboard", to: "/support" },
      { icon: Tickets, label: "tickets", to: "/support/tickets" },
      { icon: ListTodo, label: "tasks", to: "/support/tasks" },
      { icon: Users, label: "users", to: "/support/users" },
      { icon: UserStar, label: "ratings", to: "/support/ratings" },
      {
        icon: Crown,
        label: "prospective_customers",
        to: "/support/prospective-customers",
      },
      { icon: MessageCircleMore, label: "chat", to: "/support/chat" },
    ],

    routes: [
      { path: "", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "tickets", element: TicketsPage },
      { path: "tasks", element: TasksPage },
      { path: "users", element: UsersPage },
      { path: "ratings", element: RatingsPage },
      { path: "prospective-customers", element: ProspectiveCustomersPage },
      { path: "chat", element: ChatPage },
    ],
  },

  customer: {
    prefix: "customer",
    statsComponent: CustomerStats,

    sidebar: [
      { icon: LayoutDashboard, label: "dashboard", to: "/customer" },
      { icon: Tickets, label: "tickets", to: "/customer/tickets" },
      { icon: SendToBack, label: "my_requests", to: "/customer/requests" },
      { icon: MessageCircleMore, label: "chat", to: "/customer/chat" },
      {
        icon: Handshake,
        label: "add_your_opinion",
        to: "/customer/testimonials",
      },
      { icon: HeartPlus, label: "support_plan", to: "/customer/support-plan" },
    ],

    routes: [
      { path: "", element: DashboardPage },
      { path: "profile", element: ProfilePage },
      { path: "tickets", element: TicketsPage },
      { path: "requests", element: CustomerRequestsPage },
      { path: "chat", element: ChatPage },
    ],
  },
};
