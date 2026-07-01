import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-6">
          <Link
            to="/"
            className="font-semibold text-lg tracking-tight hover:opacity-80"
          >
            wgpu Viz Lab
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              to="/"
              className={cn(
                "hover:text-foreground transition-colors",
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Demos
            </Link>
            <Link
              to="/docs/$slug"
              params={{ slug: "introduction" }}
              className={cn(
                "hover:text-foreground transition-colors",
                pathname.startsWith("/docs")
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Docs
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}
