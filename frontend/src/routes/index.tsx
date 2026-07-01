import { DEMOS } from "@/demos";
import { DemoCard } from "@/components/DemoCard";

export function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Rust wgpu Viz Lab
        </h1>
        <p className="text-muted-foreground text-lg">
          High-performance data visualization using Rust, wgpu, and WebAssembly.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Demos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMOS.map((demo) => (
            <DemoCard key={demo.slug} demo={demo} />
          ))}
        </div>
      </section>
    </div>
  );
}
