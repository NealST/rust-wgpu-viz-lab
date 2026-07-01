# Introduction

Welcome to the **Rust wgpu Viz Lab** documentation.

This project explores high-performance data visualization techniques using:

- **Rust** — for systems-level performance and safety
- **wgpu** — a cross-platform graphics API based on the WebGPU standard
- **WebAssembly** — to run compiled Rust code in the browser
- **TanStack Start** — a modern full-stack React framework

## Getting Started

1. Build the Wasm module from the `crates/viz-core` directory
2. Start the frontend development server
3. Open the browser and explore the visualizations

## Architecture

```
┌──────────────┐   wasm-bindgen    ┌──────────────────┐
│  Rust/wgpu   │ ───────────────▶  │   .wasm + JS     │
│  (viz-core)  │                   │   glue code      │
└──────────────┘                   └────────┬─────────┘
                                            │
                                            ▼
                                   ┌──────────────────┐
                                   │  TanStack Start  │
                                   │  (React + Vite)  │
                                   └──────────────────┘
```

Each visualization effect is implemented as a Rust module that exposes functions via `wasm-bindgen`, which are then called from React components.
