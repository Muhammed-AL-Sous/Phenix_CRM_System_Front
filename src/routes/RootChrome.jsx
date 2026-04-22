import { Outlet } from "react-router";

import RouteNavPendingEmitter from "./RouteNavPendingEmitter";

/**
 * غلاف جذر التوجيه — حدود Suspense حول التخطيطات الكسولة في routes/index
 * وليس هنا، لأن الـ lazy داخل ProtectedRoute لا يُعلَق على Suspense أعلى منه
 */
export default function RootChrome() {
  return (
    <>
      <RouteNavPendingEmitter />
      <Outlet />
    </>
  );
}
