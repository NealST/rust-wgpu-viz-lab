import { Link } from "@tanstack/react-router";
import type { Demo } from "@/demos";

export function DemoCard({ demo }: { demo: Demo }) {
  return (
    <Link
      to="/demos/$slug"
      params={{ slug: demo.slug }}
      className="block group rounded-lg border border-border p-6 hover:border-foreground/20 hover:bg-muted/50 transition-colors"
    >
      <h3 className="font-semibold text-lg group-hover:text-foreground transition-colors">
        {demo.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{demo.description}</p>
    </Link>
  );
}
