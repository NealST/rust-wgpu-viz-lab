export interface Demo {
  slug: string;
  title: string;
  description: string;
  wasmFn: string;
  docSlug: string;
}

export const DEMOS: Demo[] = [
  {
    slug: "triangle",
    title: "Colored Triangle",
    description: "wgpu render pipeline basics: vertices, shaders, and a single draw call",
    wasmFn: "run_triangle",
    docSlug: "triangle",
  },
  {
    slug: "line-chart",
    title: "2D Line Chart",
    description: "Data-driven rendering with LineStrip topology and generated sine-wave data",
    wasmFn: "run_line_chart",
    docSlug: "line-chart",
  },
  {
    slug: "particles",
    title: "Particle System",
    description: "Compute shader animation: GPU-driven particle simulation with requestAnimationFrame loop",
    wasmFn: "run_particles",
    docSlug: "particles",
  },
];
