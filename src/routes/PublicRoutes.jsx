import { lazy } from "react";

/* الصفحة الرئيسية تُحمَّل مع التوجيه لتفادي فراغ main عند أول زيارة لـ / */
import HomePage from "../pages/HomePage";

const AboutPage = lazy(() => import("../pages/AboutPage"));
const AgentsPage = lazy(() => import("../pages/AgentsPage"));
const WhatIsNewPage = lazy(() => import("../pages/WhatIsNewPage"));

export const publicRoutes = [
  { index: true, element: <HomePage /> },
  { path: "about", element: <AboutPage /> },
  { path: "agents", element: <AgentsPage /> },
  { path: "what's_new", element: <WhatIsNewPage /> },
];
