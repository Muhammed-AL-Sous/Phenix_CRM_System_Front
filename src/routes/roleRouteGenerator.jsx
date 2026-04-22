import ProtectedRoute from "../components/common/ProtectedRoute";
import { ROLES_CONFIG } from "./roles.config";

export const generateRoleRoutes = () => {
  return Object.entries(ROLES_CONFIG).map(([role, config]) => ({
    path: config.prefix,
    element: <ProtectedRoute allowedRoles={[role]} />,
    children: config.routes.map((route) => {
      const Page = route.element;
      return {
        path: route.path,
        element: <Page />,
      };
    }),
  }));
};
