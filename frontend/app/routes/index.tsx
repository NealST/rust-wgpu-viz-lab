import { createFileRoute } from "@tanstack/react-router";
import { WgpuCanvas } from "~/components/WgpuCanvas";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1>Rust wgpu Viz Lab</h1>
      <p>
        A learning project for high-performance data visualization using Rust,
        wgpu, and WebAssembly.
      </p>
      <h2>WebGPU Canvas Demo</h2>
      <WgpuCanvas />
    </div>
  );
}
