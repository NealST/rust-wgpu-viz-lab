import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";
import { RootLayout } from "./routes/__root";
import { HomePage } from "./routes/index";
import { DocPage, loadDoc } from "./routes/docs.$slug";
import { DemoPage, loadDemo } from "./routes/demos.$slug";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const docRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs/$slug",
  loader: ({ params: { slug } }) => loadDoc(slug),
  component: DocPage,
});

const demoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/demos/$slug",
  loader: ({ params: { slug } }) => loadDemo(slug),
  component: DemoPage,
});

const routeTree = rootRoute.addChildren([indexRoute, docRoute, demoRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
