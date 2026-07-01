import { useLoaderData, Link } from "@tanstack/react-router";
import { marked } from "marked";

interface DocData {
  slug: string;
  html: string;
}

const DOC_SLUGS = [
  "introduction",
  "webgpu-basics",
  "triangle",
  "line-chart",
  "particles",
];

export async function loadDoc(slug: string): Promise<DocData> {
  const res = await fetch(`/docs/${slug}.md`);
  if (!res.ok) {
    throw new Error(`Document not found: ${slug}`);
  }
  const raw = await res.text();
  const html = await marked(raw);
  return { slug, html };
}

export function DocPage() {
  const { slug, html } = useLoaderData({ from: "/docs/$slug" });

  return (
    <div className="flex gap-8">
      <aside className="w-48 shrink-0 hidden md:block">
        <nav className="space-y-1 sticky top-8">
          <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">
            Docs
          </h3>
          {DOC_SLUGS.map((s) => (
            <Link
              key={s}
              to="/docs/$slug"
              params={{ slug: s }}
              className={`block px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                s === slug
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {s.replace(/-/g, " ")}
            </Link>
          ))}
        </nav>
      </aside>

      <article className="prose prose-neutral max-w-none flex-1 min-w-0">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}
