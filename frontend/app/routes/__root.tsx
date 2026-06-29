import {
  createRootRoute,
  Outlet,
  Link,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Rust wgpu Viz Lab</title>
      </head>
      <body>
        <nav style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/docs/introduction">Docs</Link>
        </nav>
        <main style={{ padding: "1rem" }}>
          <Outlet />
        </main>
      </body>
    </html>
  );
}
