import { Suspense } from "react";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ROLES_CONFIG } from "./roles.config";


export const generateRoleRoutes = () => {
  return Object.entries(ROLES_CONFIG).map(([role, config]) => ({
    path: config.prefix,
    element: <ProtectedRoute allowedRoles={[role]} />,
    children: config.routes.map((route) => ({
      path: route.path,
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <route.element />
        </Suspense>
      ),
    })),
  }));
};

