import { useLoaderData, Link } from "@tanstack/react-router";
import { marked } from "marked";
import { DEMOS } from "@/demos";
import { WgpuCanvas } from "@/components/WgpuCanvas";

interface DemoPageData {
  slug: string;
  title: string;
  wasmFn: string;
  docHtml: string;
}

export async function loadDemo(slug: string): Promise<DemoPageData> {
  const demo = DEMOS.find((d) => d.slug === slug);
  if (!demo) {
    throw new Error(`Demo not found: ${slug}`);
  }

  let docHtml = "";
  try {
    const res = await fetch(`/docs/${demo.docSlug}.md`);
    if (res.ok) {
      const raw = await res.text();
      docHtml = await marked(raw);
    }
  } catch {
    // Doc not available yet — that's fine
  }

  return {
    slug: demo.slug,
    title: demo.title,
    wasmFn: demo.wasmFn,
    docHtml,
  };
}

export function DemoPage() {
  const { slug, title, wasmFn, docHtml } = useLoaderData({
    from: "/demos/$slug",
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; All Demos
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </div>

      <section>
        <WgpuCanvas canvasId={`demo-${slug}`} wasmFn={wasmFn} />
      </section>

      {docHtml && (
        <section className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <article className="prose prose-neutral max-w-none">
            <div dangerouslySetInnerHTML={{ __html: docHtml }} />
          </article>
        </section>
      )}

      <nav className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Other Demos
        </h3>
        <div className="flex gap-3">
          {DEMOS.filter((d) => d.slug !== slug).map((d) => (
            <Link
              key={d.slug}
              to="/demos/$slug"
              params={{ slug: d.slug }}
              className="text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
            >
              {d.title}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
