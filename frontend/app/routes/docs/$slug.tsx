import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { marked } from "marked";
import * as fs from "node:fs";
import * as path from "node:path";

const fetchDocContent = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const docsDir = path.resolve(process.cwd(), "../content/docs");
    const filePath = path.join(docsDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Document not found: ${slug}`);
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const html = await marked(raw);
    return { slug, html, raw };
  });

export const Route = createFileRoute("/docs/$slug")({
  loader: async ({ params: { slug } }) => {
    return fetchDocContent({ data: slug });
  },
  component: DocPage,
});

function DocPage() {
  const { slug, html } = Route.useLoaderData();

  return (
    <article>
      <h1 style={{ textTransform: "capitalize" }}>{slug.replace(/-/g, " ")}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
