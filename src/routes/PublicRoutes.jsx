import AboutPage from "../pages/AboutPage";
import AgentsPage from "../pages/AgentsPage";
import HomePage from "../pages/HomePage";
import WhatIsNewPage from "../pages/WhatIsNewPage";

export const publicRoutes = [
  { path: "", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/agents", element: <AgentsPage /> },
  { path: "/what's_new", element: <WhatIsNewPage /> },
];
