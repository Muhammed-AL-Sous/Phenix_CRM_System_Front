import { Suspense } from "react";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { RouteSuspenseFallback } from "../components/common/GlobalLoader";
import { ROLES_CONFIG } from "./roles.config";

export const generateRoleRoutes = () => {
  return Object.entries(ROLES_CONFIG).map(([role, config]) => ({
    path: config.prefix,
    element: <ProtectedRoute allowedRoles={[role]} />, // Protects "Members" pages from "strangers"
    children: config.routes.map((route) => ({
      path: route.path,
      element: (
        <Suspense fallback={<RouteSuspenseFallback />}>
          <route.element />
        </Suspense>
      ),
    })),
  }));
};
